/**
 * Portable Express rate-limit helpers (copy this folder to another project).
 * Depends: `express`, `express-rate-limit` (for IP key normalization only).
 *
 * Core API:
 *   createDualLimiter      — one middleware, two independent sliding-window axes
 *                            (IP axis AND user axis). The main factory for all
 *                            application limiters.
 *   createSlidingWindowLimiter — single-axis building block; use directly when
 *                            you only need one dimension (e.g. a standalone IP
 *                            limiter for a non-user-facing service).
 *   createMemoryStore      — default in-memory store; replace with a Redis
 *                            adapter implementing { get, set } for multi-instance.
 *   defaultIpKeyForReq     — normalized IP string from req.ip / socket fallback.
 */

export { defaultIpKeyForReq } from './ipKey.js';
export { createMemoryStore } from './store.js';
export { createSlidingWindowLimiter, createIpSlidingLimiter } from './slidingWindow.js';
export { createDualLimiter } from './dualLimiter.js';
