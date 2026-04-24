import { createDualLimiter } from '../lib/rate-limit/index.js';
import { PERMISSION } from '../utils/permissionKeys.js';

export { createDualLimiter };

/**
 * LankaHouses rate-limit policy — generic primitives live in `../lib/rate-limit/`.
 *
 * Every named export is a single Express middleware from `createDualLimiter`:
 *
 *   IP-only  (userCap: null, getUserId: () => null)
 *     — pre-auth endpoints where no identity is known yet
 *     — global baseline
 *
 *   Dual AND (userCap: N, ipCap: M)
 *     — authenticated and optionally-authenticated endpoints
 *     — user axis: hard per-account ceiling, follows the account across any IP
 *     — IP axis:  flood backstop, set 2–3× the user cap to tolerate shared IPs
 *     — both must independently pass; neither compensates for the other
 *
 * Routes use limiters directly — no arrays, no spread.
 */

const parsePositiveInt = (raw, fallback) => {
  const n = Number.parseInt(String(raw ?? ''), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/** Configurable window + cap for public property read endpoints. */
const PROPERTY_LIST_SEARCH_WINDOW_MS = parsePositiveInt(
  process.env.PROPERTY_LIST_SEARCH_WINDOW_MS,
  60_000,
);
const PROPERTY_SEARCH_USER_CAP_GUEST = 10;
const PROPERTY_SEARCH_USER_CAP_USER  = 30;
const PROPERTY_SEARCH_USER_CAP_ADMIN = 100;

const PROPERTY_LIST_READ_WINDOW_MS = parsePositiveInt(
  process.env.PROPERTY_LIST_READ_WINDOW_MS,
  60_000,
);
const PROPERTY_LIST_READ_USER_CAP = parsePositiveInt(process.env.PROPERTY_LIST_READ_MAX, 60);

const PROPERTY_BY_ID_READ_WINDOW_MS = parsePositiveInt(
  process.env.PROPERTY_BY_ID_READ_WINDOW_MS,
  60_000,
);
const PROPERTY_BY_ID_READ_USER_CAP = parsePositiveInt(process.env.PROPERTY_BY_ID_READ_MAX, 60);

const authUserId   = (req) => (req.user?.id != null ? String(req.user.id) : null);
const publicUserId = (req) => (req.user?.id != null ? String(req.user.id) : null);

// ─── Global ───────────────────────────────────────────────────────────────────

/** All `/api` traffic — IP-only sliding window baseline (200 / 15 min). */
export const globalLimiter = createDualLimiter({
  windowMs:  15 * 60 * 1000,
  userCap:   null,
  ipCap:     200,
  error:     'Too many requests. Please try again later.',
  namespace: 'global',
  getUserId: () => null,
});

// ─── Auth routes ──────────────────────────────────────────────────────────────

/** POST /api/auth/refresh — IP-only (no JWT before handler). */
export const refreshTokenLimiter = createDualLimiter({
  windowMs:  60 * 1000,
  userCap:   null,
  ipCap:     5,
  error:     'Too many refresh requests. Please try again in a moment.',
  namespace: 'authrefresh',
  getUserId: () => null,
});

/** POST /api/auth/firebase-exchange — IP-only (10 / 15 min). All attempts count. */
export const firebaseExchangeLimiter = createDualLimiter({
  windowMs:  15 * 60 * 1000,
  userCap:   null,
  ipCap:     10,
  error:     'Too many login attempts. Please try again after 15 minutes.',
  namespace: 'authfbexchange',
  getUserId: () => null,
});

/** POST /api/auth/firebase-register — IP-only (5 / 1 hour). */
export const firebaseRegisterLimiter = createDualLimiter({
  windowMs:  60 * 60 * 1000,
  userCap:   null,
  ipCap:     5,
  error:     'Registration limit reached. Please try again after 1 hour.',
  namespace: 'authfbregister',
  getUserId: () => null,
});

/**
 * POST /api/auth/logout — dual when authed (optionalAuthenticate runs first),
 * IP-only when guest (publicUserId returns null).
 * userCap 60 / ipCap 120 per minute.
 */
export const logoutLimiter = createDualLimiter({
  windowMs:  60 * 1000,
  userCap:   60,
  ipCap:     120,
  error:     'Too many logout requests. Please try again in a moment.',
  namespace: 'alogout',
  getUserId: publicUserId,
});

/** GET /api/auth/me — dual; authenticate runs first so req.user is always set. */
export const getMeLimiter = createDualLimiter({
  windowMs:  60 * 1000,
  userCap:   60,
  ipCap:     180,
  error:     'Too many user session requests. Please try again in a moment.',
  namespace: 'authme',
  getUserId: authUserId,
});

// ─── User routes ──────────────────────────────────────────────────────────────

/** PATCH /api/user/profile — dual write limit (10 user / 30 IP per 15 min). */
export const profileUpdateLimiter = createDualLimiter({
  windowMs:  15 * 60 * 1000,
  userCap:   10,
  ipCap:     30,
  error:     'Too many profile update requests. Please try again later.',
  namespace: 'uprofile',
  getUserId: authUserId,
});

// ─── Property routes ──────────────────────────────────────────────────────────

/** GET /api/property/stats/listings — dual admin read (60 user / 180 IP per min). */
export const propertyStatsLimiter = createDualLimiter({
  windowMs:  60 * 1000,
  userCap:   60,
  ipCap:     180,
  error:     'Too many listing stats requests. Please try again in a moment.',
  namespace: 'pstatsread',
  getUserId: authUserId,
});

/** GET /api/property/meta/* — dual admin meta reads (60 user / 180 IP per min). */
export const propertyMetaLimiter = createDualLimiter({
  windowMs:  60 * 1000,
  userCap:   60,
  ipCap:     180,
  error:     'Too many property meta requests. Please try again in a moment.',
  namespace: 'pmetaread',
  getUserId: authUserId,
});

/** POST /api/property — dual admin write (10 user / 30 IP per min). */
export const propertyCreateLimiter = createDualLimiter({
  windowMs:  60 * 1000,
  userCap:   10,
  ipCap:     30,
  error:     'Property creation limit reached. Please slow down.',
  namespace: 'pcreate',
  getUserId: authUserId,
});

/**
 * PATCH/DELETE /api/property/:id and image mutations — shared modify bucket
 * (30 user / 90 IP per min). All four mutation operations draw from the same
 * namespace, so the combined total is capped at 30 per admin per minute.
 */
export const propertyModifyLimiter = createDualLimiter({
  windowMs:  60 * 1000,
  userCap:   30,
  ipCap:     90,
  error:     'Too many property modifications. Please slow down.',
  namespace: 'pmod',
  getUserId: authUserId,
});

/**
 * GET /api/property without `search` — guests hit IP-only (publicUserId → null),
 * authed users hit dual. Skipped when `search` query param is present.
 * Requires optionalAuthenticate before.
 */
export const propertyListReadLimiter = createDualLimiter({
  windowMs:  PROPERTY_LIST_READ_WINDOW_MS,
  userCap:   PROPERTY_LIST_READ_USER_CAP,
  ipCap:     PROPERTY_LIST_READ_USER_CAP * 2,
  error:     'Too many property list requests. Please try again in a moment.',
  namespace: 'plistread',
  getUserId: publicUserId,
  skip:      (req) => Boolean(String(req.query?.search ?? '').trim()),
});

/**
 * GET /api/property/:id — guests IP-only, authed dual.
 * Requires optionalAuthenticate before.
 */
export const propertyByIdReadLimiter = createDualLimiter({
  windowMs:  PROPERTY_BY_ID_READ_WINDOW_MS,
  userCap:   PROPERTY_BY_ID_READ_USER_CAP,
  ipCap:     PROPERTY_BY_ID_READ_USER_CAP * 2,
  error:     'Too many property detail requests. Please try again in a moment.',
  namespace: 'pbyid',
  getUserId: publicUserId,
});

// ─── SuperAdmin routes ────────────────────────────────────────────────────────

/** GET /api/superadmin — dual read limit (60 user / 180 IP per min). */
export const superAdminListLimiter = createDualLimiter({
  windowMs:  60 * 1000,
  userCap:   60,
  ipCap:     180,
  error:     'Too many user list requests. Please try again in a moment.',
  namespace: 'saList',
  getUserId: authUserId,
});

/** GET /api/superadmin/stats — dual read limit (60 user / 180 IP per min). */
export const superAdminStatsLimiter = createDualLimiter({
  windowMs:  60 * 1000,
  userCap:   60,
  ipCap:     180,
  error:     'Too many user stat requests. Please try again in a moment.',
  namespace: 'saStats',
  getUserId: authUserId,
});

/** POST /api/superadmin/admins — privileged write (10 user / 30 IP per min). */
export const superAdminCreateLimiter = createDualLimiter({
  windowMs:  60 * 1000,
  userCap:   10,
  ipCap:     30,
  error:     'Admin creation limit reached. Please slow down.',
  namespace: 'saCreate',
  getUserId: authUserId,
});

const searchUserCapFn = (req) => {
  if (!req.user) return PROPERTY_SEARCH_USER_CAP_GUEST;
  if (req.user.permissions?.includes(PERMISSION.ADMIN_ACCESS)) return PROPERTY_SEARCH_USER_CAP_ADMIN;
  return PROPERTY_SEARCH_USER_CAP_USER;
};

const searchIpCapFn = (req) => searchUserCapFn(req) * 2;

/**
 * GET /api/property when `search` is set — tiered dual limiter.
 *   Guest:  10 / window IP-only
 *   User:   30 user / 60 IP per window, weighted dual
 *   Admin: 100 user / 200 IP per window, weighted dual
 * Requires optionalAuthenticate before. Skipped when `search` is absent.
 */
export const propertyListSearchLimiter = createDualLimiter({
  windowMs:  PROPERTY_LIST_SEARCH_WINDOW_MS,
  userCap:   searchUserCapFn,
  ipCap:     searchIpCapFn,
  error:     'Too many property search requests. Please try again in a moment.',
  namespace: 'propsearch',
  getUserId: publicUserId,
  skip:      (req) => !String(req.query?.search ?? '').trim(),
});
