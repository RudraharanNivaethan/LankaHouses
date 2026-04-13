import { defaultIpKeyForReq } from './ipKey.js';
import { createMemoryStore } from './store.js';

/**
 * Sliding window counter — single axis (one key type: either user or IP).
 *
 * Algorithm (Cloudflare / Upstash style):
 *   Each key stores { prev, curr, windowStart }.
 *
 *   On every request:
 *     elapsed = now - windowStart
 *     if elapsed >= 2 * windowMs → reset both buckets, new windowStart
 *     else if elapsed >= windowMs → roll: prev = curr, curr = 0, windowStart += windowMs
 *     position = elapsed / windowMs              (0–1 within current window)
 *     effective = prev × (1 - position) + curr   (weighted look-back)
 *     if effective + 1 > cap → reject, no increment
 *     else curr += 1, admit
 *
 * Properties:
 *   - No boundary burst: previous window's count decays linearly instead of
 *     hard-resetting to 0, so the effective cap at any instant is always ≤ cap.
 *   - O(1) memory per key, O(1) per request.
 *   - Pluggable store: pass a Redis adapter and nothing else changes.
 *
 * @param {object} opts
 * @param {number} opts.windowMs
 * @param {number | ((req: import('express').Request) => number)} opts.cap
 * @param {string} opts.namespace   - Unique prefix; prevents key collisions between limiters.
 * @param {string} opts.error       - Message sent in the 429 JSON body.
 * @param {(req: import('express').Request) => string | null} opts.getKey
 *   Return null to skip this axis for the current request (e.g. no userId yet).
 * @param {{ get: Function, set: Function }} [opts.store]  Defaults to createMemoryStore().
 * @param {(req: import('express').Request) => boolean} [opts.skip]
 * @returns {import('express').RequestHandler}
 */
export const createSlidingWindowLimiter = ({
  windowMs,
  cap,
  namespace,
  error,
  getKey,
  store = createMemoryStore(),
  skip = () => false,
}) => {
  const capFn = typeof cap === 'function' ? cap : () => cap;

  return (req, res, next) => {
    if (skip(req)) return next();

    const key = getKey(req);
    if (key == null) return next();

    const limit = capFn(req);
    if (!(limit > 0)) {
      return res.status(500).json({ success: false, error: 'Rate limit misconfiguration' });
    }

    const now = Date.now();
    const fullKey = `${namespace}:${key}`;
    let entry = store.get(fullKey) ?? { prev: 0, curr: 0, windowStart: now };

    const elapsed = now - entry.windowStart;

    if (elapsed >= 2 * windowMs) {
      entry = { prev: 0, curr: 0, windowStart: now };
    } else if (elapsed >= windowMs) {
      entry = { prev: entry.curr, curr: 0, windowStart: entry.windowStart + windowMs };
    }

    const position = (now - entry.windowStart) / windowMs;
    const effective = entry.prev * (1 - position) + entry.curr;

    if (effective + 1 > limit) {
      store.set(fullKey, entry);
      const windowEnd = entry.windowStart + windowMs;
      const retryMs = windowEnd - now;
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil(retryMs / 1000))));
      return res.status(429).json({ success: false, error });
    }

    store.set(fullKey, { ...entry, curr: entry.curr + 1 });
    return next();
  };
};

/**
 * Convenience factory: IP-keyed sliding window limiter.
 * Used internally by createDualLimiter but also usable standalone.
 *
 * @param {Omit<Parameters<typeof createSlidingWindowLimiter>[0], 'getKey'> & { getIpKey?: Function }} opts
 */
export const createIpSlidingLimiter = ({ getIpKey = defaultIpKeyForReq, ...opts }) =>
  createSlidingWindowLimiter({ ...opts, getKey: (req) => getIpKey(req) });
