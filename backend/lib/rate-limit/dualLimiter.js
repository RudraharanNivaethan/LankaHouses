import { defaultIpKeyForReq } from './ipKey.js';
import { createSlidingWindowLimiter } from './slidingWindow.js';
import { createMemoryStore } from './store.js';

/**
 * Dual-bucket rate limiter: IP axis AND user axis (independent, not weighted).
 *
 * Enforcement model:
 *   A request is admitted only when BOTH of the following are true:
 *     1. IP sliding window:   ipCount  ≤ ipCap
 *     2. User sliding window: userCount ≤ userCap  (skipped when getUserId returns null)
 *
 *   Neither axis can be compensated by the other. An authenticated attacker
 *   rotating IPs gains zero extra budget because the user axis is an independent
 *   hard ceiling. Multiple accounts on a shared IP still accumulate pressure on
 *   the IP axis regardless of which account is making the request.
 *
 * Axis roles:
 *   User axis — anti-abuse: tight cap tied to a specific account. Follows the
 *               attacker across every IP they rotate through.
 *   IP axis   — flood backstop: set higher (2–3× user cap) to tolerate legitimate
 *               shared IPs (office NAT, campus networks) while still blocking
 *               raw IP floods and multi-account abuse from a single machine.
 *
 * IP-only mode:
 *   Pass getUserId: () => null  (or let it return null at runtime).
 *   Only the IP axis runs — used for pre-auth endpoints where no identity is known.
 *
 * Pluggable store:
 *   A single shared store is created per createDualLimiter call and used for both
 *   axes. Pass your own store (e.g. a Redis adapter implementing { get, set }) to
 *   share state across processes. The store interface is documented in store.js.
 *
 * Rejection behaviour:
 *   On 429, neither counter is incremented. The Retry-After header is set to the
 *   ceiling of the remaining seconds in the blocking axis's current window.
 *
 * @param {object} opts
 * @param {number} opts.windowMs
 * @param {number | ((req: import('express').Request) => number) | null} opts.userCap
 *   null → disable the user axis entirely (IP-only mode).
 * @param {number | ((req: import('express').Request) => number)} opts.ipCap
 * @param {string} opts.namespace   - Unique prefix shared by both axes.
 * @param {string} opts.error       - Message in 429 body.
 * @param {(req: import('express').Request) => string | null} opts.getUserId
 *   Return null at runtime to fall back to IP-only for that specific request
 *   (e.g. optionalAuthenticate routes where req.user may or may not be set).
 * @param {(req: import('express').Request) => string} [opts.getIpKey]
 * @param {(req: import('express').Request) => boolean} [opts.skip]
 * @param {{ get: Function, set: Function }} [opts.store]
 * @returns {import('express').RequestHandler}
 */
export const createDualLimiter = ({
  windowMs,
  userCap,
  ipCap,
  namespace,
  error,
  getUserId,
  getIpKey = defaultIpKeyForReq,
  skip = () => false,
  store = createMemoryStore(),
}) => {
  const ipLimiter = createSlidingWindowLimiter({
    windowMs,
    cap: ipCap,
    namespace: `${namespace}:ip`,
    error,
    getKey: (req) => getIpKey(req),
    store,
    skip,
  });

  const userLimiter =
    userCap == null
      ? null
      : createSlidingWindowLimiter({
          windowMs,
          cap: userCap,
          namespace: `${namespace}:u`,
          error,
          getKey: (req) => {
            const uid = getUserId(req);
            return uid != null ? String(uid) : null;
          },
          store,
          skip,
        });

  return (req, res, next) => {
    ipLimiter(req, res, (ipErr) => {
      if (ipErr !== undefined) return next(ipErr);
      if (res.headersSent) return;
      if (userLimiter == null) return next();
      userLimiter(req, res, next);
    });
  };
};
