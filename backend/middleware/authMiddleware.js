import jwt from 'jsonwebtoken';
import { CUSTOMER_JWT_SECRET, ADMIN_JWT_SECRET } from '../config/jwtConfig.js';

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const unverified = jwt.decode(token);
  if (!unverified?.role) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const secret = unverified.role === 'admin' ? ADMIN_JWT_SECRET : CUSTOMER_JWT_SECRET;

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
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  next();
};