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

const ipKeyForReq = (req) => {
  const ip = req.ip ?? req.socket?.remoteAddress ?? '';
  return ipKeyGenerator(ip || '0.0.0.0');
};

const rateLimitShared = (error) => ({
  message:         { success: false, error },
  standardHeaders: true,
  legacyHeaders:   false,
  validate:        { trustProxy: false },
});

/**
 * Guest: one IP bucket. Authenticated: same window/max on user id and on IP (shared by all accounts on that IP).
 * Returns [guestIpMw, authUserMw, authIpMw].
 */
const createGuestAndAuthDualLimiters = ({
  windowMs,
  maxGuest,
  maxAuth,
  error,
  namespace,
  skip = () => false,
}) => {
  const maxAuthFn = typeof maxAuth === 'function' ? maxAuth : () => maxAuth;
  const shared = rateLimitShared(error);

  const guestMw = rateLimit({
    windowMs,
    max: maxGuest,
    ...shared,
    skip: (req) => skip(req) || !!req.user,
    keyGenerator: (req) => `${namespace}:g:${ipKeyForReq(req)}`,
  });

  const userMw = rateLimit({
    windowMs,
    max: maxAuthFn,
    ...shared,
    skip: (req) => skip(req) || !req.user,
    keyGenerator: (req) => `${namespace}:u:${req.user.id}`,
  });

  const authIpMw = rateLimit({
    windowMs,
    max: maxAuthFn,
    ...shared,
    skip: (req) => skip(req) || !req.user,
    keyGenerator: (req) => `${namespace}:aip:${ipKeyForReq(req)}`,
  });

  return [guestMw, userMw, authIpMw];
};

/** Authenticated routes only: user id + IP buckets (same max/window). */
const createAuthOnlyDualLimiters = ({ windowMs, max, error, namespace }) => {
  const maxFn = typeof max === 'function' ? max : () => max;
  const shared = rateLimitShared(error);

  const userMw = rateLimit({
    windowMs,
    max: maxFn,
    ...shared,
    skip: (req) => !req.user,
    keyGenerator: (req) => `${namespace}:u:${req.user.id}`,
  });

  const authIpMw = rateLimit({
    windowMs,
    max: maxFn,
    ...shared,
    skip: (req) => !req.user,
    keyGenerator: (req) => `${namespace}:aip:${ipKeyForReq(req)}`,
  });

  return [userMw, authIpMw];
};

export const globalLimiter         = createLimiter(15 * 60 * 1000, 200, 'Too many requests. Please try again later.');
// [OLD CODE] export const loginLimiter    = createLimiter(15 * 60 * 1000,  5, 'Too many login attempts. Please try again after 15 minutes.', { skipSuccessfulRequests: true });
// [OLD CODE] export const registerLimiter = createLimiter(60 * 60 * 1000,  3, 'Maximum registration limit reached. Please try again after 1 hour.');
export const refreshTokenLimiter   = createLimiter(     60 * 1000,   5, 'Too many refresh requests. Please try again in a moment.');
export const firebaseExchangeLimiter  = createLimiter(15 * 60 * 1000, 10, 'Too many login attempts. Please try again after 15 minutes.', { skipSuccessfulRequests: true });
export const firebaseRegisterLimiter  = createLimiter(60 * 60 * 1000,  5, 'Registration limit reached. Please try again after 1 hour.');
export const profileUpdateLimiter     = createLimiter(15 * 60 * 1000, 10, 'Too many profile update requests. Please try again later.');

/** POST /api/property — admin create; 10/min per user and per IP (authenticated). */
export const propertyCreateDualLimiters = createAuthOnlyDualLimiters({
  windowMs: 60 * 1000,
  max:      10,
  error:    'Property creation limit reached. Please slow down.',
  namespace: 'pcreate',
});

/** PATCH/DELETE property and image mutations — 30/min per user and per IP (authenticated). */
export const propertyModifyDualLimiters = createAuthOnlyDualLimiters({
  windowMs: 60 * 1000,
  max:      30,
  error:    'Too many property modifications. Please slow down.',
  namespace: 'pmod',
});

/** GET /api/property when `search` is absent — guest IP-only; logged-in user + IP dual buckets. Skipped when `search` is set. */
export const propertyListReadLimiters = createGuestAndAuthDualLimiters({
  windowMs: PROPERTY_LIST_READ_WINDOW_MS,
  maxGuest: PROPERTY_LIST_READ_MAX,
  maxAuth:  PROPERTY_LIST_READ_MAX,
  error:    'Too many property list requests. Please try again in a moment.',
  namespace: 'plistread',
  skip:     (req) => Boolean(String(req.query?.search ?? '').trim()),
});

/** GET /api/property/:id — guest IP-only; logged-in dual user + IP. Requires optionalAuthenticate before chain. */
export const propertyByIdReadLimiters = createGuestAndAuthDualLimiters({
  windowMs: PROPERTY_BY_ID_READ_WINDOW_MS,
  maxGuest: PROPERTY_BY_ID_READ_MAX,
  maxAuth:  PROPERTY_BY_ID_READ_MAX,
  error:    'Too many property detail requests. Please try again in a moment.',
  namespace: 'pbyid',
});

const propertySearchTierMaxAuth = (req) => {
  if (req.user.role === 'admin') return PROPERTY_SEARCH_MAX_ADMIN;
  return PROPERTY_SEARCH_MAX_USER;
};

/**
 * GET /api/property when `search` is set: guest 10/min IP; user 30/min and admin 100/min on both user id and IP keys.
 * Requires `optionalAuthenticate` before this middleware chain.
 */
export const propertyListSearchTieredLimiters = createGuestAndAuthDualLimiters({
  windowMs: PROPERTY_LIST_SEARCH_WINDOW_MS,
  maxGuest: PROPERTY_SEARCH_MAX_GUEST,
  maxAuth:  propertySearchTierMaxAuth,
  error:    'Too many property search requests. Please try again in a moment.',
  namespace: 'propsearch',
  skip:     (req) => !String(req.query?.search ?? '').trim(),
});
