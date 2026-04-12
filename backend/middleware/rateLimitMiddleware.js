import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const parsePositiveInt = (raw, fallback) => {
  const n = Number.parseInt(String(raw ?? ''), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/** Window for tiered GET /api/property?search=… limits (guest / user / admin). */
const PROPERTY_LIST_SEARCH_WINDOW_MS = parsePositiveInt(
  process.env.PROPERTY_LIST_SEARCH_WINDOW_MS,
  60_000,
);

const PROPERTY_SEARCH_MAX_GUEST = 10;
const PROPERTY_SEARCH_MAX_USER = 30;
const PROPERTY_SEARCH_MAX_ADMIN = 100;

/** GET /api/property without `search` — per IP. */
const PROPERTY_LIST_READ_WINDOW_MS = parsePositiveInt(
  process.env.PROPERTY_LIST_READ_WINDOW_MS,
  60_000,
);
const PROPERTY_LIST_READ_MAX = parsePositiveInt(process.env.PROPERTY_LIST_READ_MAX, 60);

/** GET /api/property/:id — per IP (separate bucket from list read). */
const PROPERTY_BY_ID_READ_WINDOW_MS = parsePositiveInt(
  process.env.PROPERTY_BY_ID_READ_WINDOW_MS,
  60_000,
);
const PROPERTY_BY_ID_READ_MAX = parsePositiveInt(process.env.PROPERTY_BY_ID_READ_MAX, 60);

const createLimiter = (windowMs, max, error, options = {}) =>
  rateLimit({
    windowMs,
    max,
    message:         { success: false, error },
    standardHeaders: true,
    legacyHeaders:   false,
    validate:        { trustProxy: false },
    ...options
  });

export const globalLimiter         = createLimiter(15 * 60 * 1000, 200, 'Too many requests. Please try again later.');
// [OLD CODE] export const loginLimiter    = createLimiter(15 * 60 * 1000,  5, 'Too many login attempts. Please try again after 15 minutes.', { skipSuccessfulRequests: true });
// [OLD CODE] export const registerLimiter = createLimiter(60 * 60 * 1000,  3, 'Maximum registration limit reached. Please try again after 1 hour.');
export const refreshTokenLimiter   = createLimiter(     60 * 1000,   5, 'Too many refresh requests. Please try again in a moment.');
export const firebaseExchangeLimiter  = createLimiter(15 * 60 * 1000, 10, 'Too many login attempts. Please try again after 15 minutes.', { skipSuccessfulRequests: true });
export const firebaseRegisterLimiter  = createLimiter(60 * 60 * 1000,  5, 'Registration limit reached. Please try again after 1 hour.');
export const profileUpdateLimiter     = createLimiter(15 * 60 * 1000, 10, 'Too many profile update requests. Please try again later.');

/** POST /api/property — admin create; 10 requests per minute per authenticated user. */
export const propertyCreateLimiter = createLimiter(
  60 * 1000,
  10,
  'Property creation limit reached. Please slow down.',
  {
    keyGenerator: (req) =>
      req.user?.id != null
        ? `prop-create:${req.user.id}`
        : `prop-create:${ipKeyGenerator(req.ip ?? req.socket?.remoteAddress ?? '0.0.0.0')}`,
  },
);

/** PATCH/DELETE property and image mutations — 30 requests per minute per authenticated user (shared bucket). */
export const propertyModifyLimiter = createLimiter(
  60 * 1000,
  30,
  'Too many property modifications. Please slow down.',
  {
    keyGenerator: (req) =>
      req.user?.id != null
        ? `prop-modify:${req.user.id}`
        : `prop-modify:${ipKeyGenerator(req.ip ?? req.socket?.remoteAddress ?? '0.0.0.0')}`,
  },
);

/** GET /api/property when `search` is absent — caps list scraping; skipped when `search` is set (search limiter applies). */
export const propertyListReadLimiter = createLimiter(
  PROPERTY_LIST_READ_WINDOW_MS,
  PROPERTY_LIST_READ_MAX,
  'Too many property list requests. Please try again in a moment.',
  {
    skip: (req) => Boolean(String(req.query?.search ?? '').trim()),
    keyGenerator: (req) => {
      const ip = req.ip ?? req.socket?.remoteAddress ?? '';
      return `prop-list-read:${ipKeyGenerator(ip || '0.0.0.0')}`;
    },
  },
);

/** GET /api/property/:id — single-document reads per IP. */
export const propertyByIdReadLimiter = createLimiter(
  PROPERTY_BY_ID_READ_WINDOW_MS,
  PROPERTY_BY_ID_READ_MAX,
  'Too many property detail requests. Please try again in a moment.',
  {
    keyGenerator: (req) => {
      const ip = req.ip ?? req.socket?.remoteAddress ?? '';
      return `prop-by-id-read:${ipKeyGenerator(ip || '0.0.0.0')}`;
    },
  },
);

/**
 * GET /api/property when `search` is set: guest 10/min, logged-in user 30/min, admin 100/min (per IP or user).
 * Requires `optionalAuthenticate` before this middleware so `req.user` is set when a valid cookie exists.
 */
export const propertyListSearchTieredLimiter = rateLimit({
  windowMs: PROPERTY_LIST_SEARCH_WINDOW_MS,
  max: (req) => {
    if (!req.user) return PROPERTY_SEARCH_MAX_GUEST;
    if (req.user.role === 'admin') return PROPERTY_SEARCH_MAX_ADMIN;
    return PROPERTY_SEARCH_MAX_USER;
  },
  keyGenerator: (req) => {
    if (req.user?.id != null) {
      return `propsearch:user:${req.user.role}:${req.user.id}`;
    }
    const ip = req.ip ?? req.socket?.remoteAddress ?? '';
    return `propsearch:${ipKeyGenerator(ip || '0.0.0.0')}`;
  },
  message: { success: false, error: 'Too many property search requests. Please try again in a moment.' },
  skip: (req) => !String(req.query?.search ?? '').trim(),
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});
