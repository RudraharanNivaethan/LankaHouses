import rateLimit from 'express-rate-limit';

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
export const searchLimiter         = createLimiter(     60 * 1000,  60, 'Too many requests. Please try again in a moment.');
export const propertyCreateLimiter = createLimiter(     60 * 1000,   5, 'Property creation limit reached. Please slow down.');
export const propertyModifyLimiter = createLimiter(     60 * 1000,  10, 'Too many property modifications. Please slow down.');
export const propertyReadLimiter   = createLimiter(     60 * 1000,  60, 'Too many property requests. Please slow down.');
export const adminReadLimiter      = createLimiter(     60 * 1000,  30, 'Too many requests. Please slow down.');
