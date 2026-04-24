import jwt from 'jsonwebtoken';
import { getAccessJwtSecretForRole } from '../config/jwtConfig.js';
import { roleSatisfies } from '../utils/roleUtils.js';

/**
 * Attaches `req.user` when a valid access token cookie is present; otherwise `req.user` is null.
 * Never sends 401 — for public routes that apply optional tiered rate limits.
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
    req.user = { id: decoded.id, role: decoded.role };
  } catch {
    // expired or invalid token — treat as guest
  }
  next();
};

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
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roleSatisfies(req.user.role, roles)) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  next();
};