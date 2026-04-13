import { describe, expect, it, beforeEach } from '@jest/globals';
import { createDualLimiter } from './dualLimiter.js';
import { createMemoryStore } from './store.js';
import { createSlidingWindowLimiter } from './slidingWindow.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeReq = ({ ip = '1.2.3.4', userId = null } = {}) => ({
  ip,
  socket: {},
  user: userId != null ? { id: userId } : undefined,
});

const makeRes = () => {
  const res = {
    statusCode: null,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; },
  };
  return res;
};

const fire = (mw, req) =>
  new Promise((resolve) => {
    const res = makeRes();
    mw(req, res, () => resolve({ passed: true, res }));
    if (res.statusCode === 429) resolve({ passed: false, res });
  });

// ─── Sliding window: no boundary burst ────────────────────────────────────────

describe('createSlidingWindowLimiter — no boundary burst', () => {
  it('effective cap is never exceeded at window boundary', () => {
    const store = createMemoryStore();
    const windowMs = 1000;
    const cap = 5;

    // Manually seed a full previous window with count = cap (simulates a caller
    // who used all their budget in the window that just ended).
    const ip = '10.0.0.1';
    const key = `sw_test:ip:10.0.0.1`;
    const now = Date.now();
    // previous window started 1×windowMs ago → elapsed = windowMs = exactly on boundary
    store.set(key, { prev: cap, curr: 0, windowStart: now - windowMs });

    const mw = createSlidingWindowLimiter({
      windowMs,
      cap,
      namespace: 'sw_test:ip',
      error: 'too many',
      getKey: () => ip,
      store,
    });

    const res = makeRes();
    let nextCalled = false;
    mw(makeReq(), res, () => { nextCalled = true; });

    // At exactly the boundary, prev × (1 - 1.0) = 0, so the new window starts
    // fresh. The first request should pass.
    expect(nextCalled).toBe(true);

    // Now seed a partial overlap: prev = cap, elapsed = 0.5 × windowMs
    // effective = cap × 0.5 + 0 = cap/2 — so cap/2 more requests should pass.
    store.set(key, { prev: cap, curr: 0, windowStart: now - windowMs * 0.5 });

    let passed = 0;
    for (let i = 0; i < cap + 5; i++) {
      const r = makeRes();
      let ok = false;
      mw(makeReq(), r, () => { ok = true; });
      if (ok) passed++;
    }
    // effective starts at 2.5, each pass adds 1; should admit floor(cap - cap×0.5) = 2 or 3
    // depending on float rounding — crucially NOT cap (5), proving no burst doubling.
    expect(passed).toBeLessThan(cap);
  });
});

// ─── IP-only mode ─────────────────────────────────────────────────────────────

describe('createDualLimiter — IP-only mode (userCap: null)', () => {
  let store;
  let mw;

  beforeEach(() => {
    store = createMemoryStore();
    mw = createDualLimiter({
      windowMs: 60_000,
      userCap: null,
      ipCap: 3,
      error: 'too many',
      namespace: 'test_iponly',
      getUserId: () => null,
      store,
    });
  });

  it('admits up to ipCap requests from the same IP', async () => {
    const req = makeReq({ ip: '5.5.5.5' });
    for (let i = 0; i < 3; i++) {
      const { passed } = await fire(mw, req);
      expect(passed).toBe(true);
    }
  });

  it('blocks the (ipCap + 1)th request from the same IP', async () => {
    const req = makeReq({ ip: '5.5.5.6' });
    for (let i = 0; i < 3; i++) await fire(mw, req);
    const { passed, res } = await fire(mw, req);
    expect(passed).toBe(false);
    expect(res.statusCode).toBe(429);
    expect(res.headers['Retry-After']).toBeDefined();
  });

  it('does not share budget across different IPs', async () => {
    for (let i = 0; i < 3; i++) await fire(mw, makeReq({ ip: '5.5.5.7' }));
    const { passed } = await fire(mw, makeReq({ ip: '5.5.5.8' }));
    expect(passed).toBe(true);
  });
});

// ─── Dual AND enforcement ─────────────────────────────────────────────────────

describe('createDualLimiter — AND enforcement', () => {
  let store;
  let mw;

  beforeEach(() => {
    store = createMemoryStore();
    mw = createDualLimiter({
      windowMs: 60_000,
      userCap: 3,
      ipCap: 10,
      error: 'too many',
      namespace: 'test_dual',
      getUserId: (req) => req.user?.id ?? null,
      store,
    });
  });

  it('blocks when user cap exhausted even though IP budget remains', async () => {
    const req = makeReq({ ip: '9.0.0.1', userId: 'user-a' });
    for (let i = 0; i < 3; i++) {
      const { passed } = await fire(mw, req);
      expect(passed).toBe(true);
    }
    const { passed } = await fire(mw, req);
    expect(passed).toBe(false);
  });

  it('blocks when IP cap exhausted even though user budget remains', async () => {
    // Use 10 different users from the same IP to exhaust the IP cap.
    for (let i = 0; i < 10; i++) {
      const req = makeReq({ ip: '9.0.0.2', userId: `user-${i}` });
      const { passed } = await fire(mw, req);
      expect(passed).toBe(true);
    }
    // Now a fresh user from the same IP — user cap is 0 but IP cap is full.
    const { passed } = await fire(mw, makeReq({ ip: '9.0.0.2', userId: 'user-new' }));
    expect(passed).toBe(false);
  });
});

// ─── IP rotation gives zero extra budget ──────────────────────────────────────

describe('createDualLimiter — IP rotation hard ceiling', () => {
  it('user cap is a hard ceiling regardless of IP rotation', async () => {
    const store = createMemoryStore();
    const userCap = 5;
    const mw = createDualLimiter({
      windowMs: 60_000,
      userCap,
      ipCap: 100,   // very high — IP axis is not the limiting factor
      error: 'too many',
      namespace: 'test_rotation',
      getUserId: (req) => req.user?.id ?? null,
      store,
    });

    let passed = 0;
    // Rotate to a fresh IP on every single request.
    for (let i = 0; i < userCap + 5; i++) {
      const req = makeReq({ ip: `200.0.${i}.1`, userId: 'rotating-attacker' });
      const result = await fire(mw, req);
      if (result.passed) passed++;
    }

    // Must be exactly userCap — IP rotation provides zero extra budget.
    expect(passed).toBe(userCap);
  });
});

// ─── Shared-IP multi-account pressure ────────────────────────────────────────

describe('createDualLimiter — shared IP multi-account', () => {
  it('IP counter accumulates across accounts on the same IP', async () => {
    const store = createMemoryStore();
    const ipCap = 4;
    const mw = createDualLimiter({
      windowMs: 60_000,
      userCap: 100,  // user cap very high — user axis is not the limiting factor
      ipCap,
      error: 'too many',
      namespace: 'test_sharedip',
      getUserId: (req) => req.user?.id ?? null,
      store,
    });

    const SHARED_IP = '10.10.10.10';
    // Three distinct accounts all from the same IP.
    const accounts = ['acct-1', 'acct-2', 'acct-3'];
    let passed = 0;
    let i = 0;

    outer:
    for (const uid of accounts) {
      for (let j = 0; j < 3; j++) {
        const req = makeReq({ ip: SHARED_IP, userId: uid });
        const result = await fire(mw, req);
        if (result.passed) passed++;
        else break outer;
        i++;
      }
    }

    // Once the shared IP bucket hits ipCap (4), all further requests from that
    // IP are blocked regardless of which account is making the request.
    expect(passed).toBe(ipCap);
  });
});

// ─── Guest fallback on dual limiter ───────────────────────────────────────────

describe('createDualLimiter — guest falls back to IP-only', () => {
  it('unauthenticated requests are measured by IP only', async () => {
    const store = createMemoryStore();
    const ipCap = 3;
    const mw = createDualLimiter({
      windowMs: 60_000,
      userCap: 1,    // user cap very tight — but should not apply for guests
      ipCap,
      error: 'too many',
      namespace: 'test_guest',
      getUserId: (req) => req.user?.id ?? null,   // returns null for guests
      store,
    });

    const req = makeReq({ ip: '7.7.7.7' });  // no userId → guest
    let passed = 0;
    for (let i = 0; i < ipCap + 2; i++) {
      const { passed: p } = await fire(mw, req);
      if (p) passed++;
    }
    // Should admit exactly ipCap requests, not 1 (the user cap).
    expect(passed).toBe(ipCap);
  });
});
