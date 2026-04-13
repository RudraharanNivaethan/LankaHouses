/**
 * Rate-limit store interface and default in-memory implementation.
 *
 * The interface is intentionally minimal so any backing store (Redis, Memcached,
 * DynamoDB, etc.) can be wired in without touching the algorithm or policy layers.
 *
 * ─── Interface ───────────────────────────────────────────────────────────────
 *
 *   get(key: string): SlidingEntry | undefined
 *   set(key: string, value: SlidingEntry): void
 *
 * where SlidingEntry = { prev: number, curr: number, windowStart: number }
 *
 *   prev        — request count in the previous fixed window
 *   curr        — request count in the current fixed window
 *   windowStart — Unix ms timestamp of the start of the current window
 *
 * A Redis adapter example:
 *
 *   const createRedisStore = (client) => ({
 *     async get(key) {
 *       const raw = await client.get(key);
 *       return raw ? JSON.parse(raw) : undefined;
 *     },
 *     async set(key, value) {
 *       // TTL of 2× window keeps stale keys from accumulating
 *       await client.set(key, JSON.stringify(value), 'PX', value.windowStart + 2 * windowMs - Date.now());
 *     },
 *   });
 *
 * Note: for async stores the slidingWindow.js middleware would need to be made
 * async. The synchronous in-memory default keeps things simple for single-process
 * deployments; upgrade the store when moving to multi-instance.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Default synchronous in-memory store. Per-process, lost on restart.
 * Suitable for single-instance deployments; replace with a shared store for
 * multi-process or multi-instance setups.
 *
 * @returns {{ get: (key: string) => {prev:number,curr:number,windowStart:number}|undefined, set: (key: string, value: {prev:number,curr:number,windowStart:number}) => void }}
 */
export const createMemoryStore = () => {
  /** @type {Map<string, {prev: number, curr: number, windowStart: number}>} */
  const map = new Map();
  return {
    get: (key) => map.get(key),
    set: (key, value) => map.set(key, value),
  };
};
