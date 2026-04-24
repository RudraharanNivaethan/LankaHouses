import jwt from 'jsonwebtoken';
import { getAccessJwtSecretForRole } from '../config/jwtConfig.js';
import { getPermissionsForRole } from '../utils/permissions.js';

/**
 * Attaches `req.user` when a valid access token cookie is present; otherwise
 * `req.user` is null. Never sends 401 — for public routes that apply optional
 * tiered rate limits.
 *
 * `req.user` shape: { id, role, permissions: string[] }
 */
export const optionalAuthenticate = (req, res, next) => {
  req.user = null;
  const token = req.cookies?.token;
  if (!token) return next();

  const unverified = jwt.decode(token);
  if (!unverified?.role) return next();

  const secret = getAccessJwtSecretForRole(unverified.role);

  try {
    const decoded = jwt.verify(token, secret);
    if (decoded.type === 'refresh') return next();
    req.user = {
      id:          decoded.id,
      role:        decoded.role,
      permissions: getPermissionsForRole(decoded.role),
    };
  } catch {
    // expired or invalid token — treat as guest
  }
  next();
};

/**
 * Requires a valid access token cookie. Returns 401 if missing or invalid.
 *
 * `req.user` shape: { id, role, permissions: string[] }
 */
export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const unverified = jwt.decode(token);
  if (!unverified?.role) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const secret = getAccessJwtSecretForRole(unverified.role);

  try {
    const decoded = jwt.verify(token, secret);
    if (decoded.type === 'refresh') {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    req.user = {
      id:          decoded.id,
      role:        decoded.role,
      permissions: getPermissionsForRole(decoded.role),
    };
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};

/**
 * Permission-key authorization middleware.
 *
 * Usage: authorize(PERMISSION.PROPERTIES_MANAGE)
 *        authorize(PERMISSION.USERS_READ, PERMISSION.ADMINS_CREATE)  // all keys required
 *
 * Returns 403 if the user does not hold ALL of the specified permission keys.
 * Role is NEVER used here — only `req.user.permissions`.
 */
export const authorize = (...keys) => (req, res, next) => {
  if (!req.user || !keys.every(k => req.user.permissions.includes(k))) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  next();
};
