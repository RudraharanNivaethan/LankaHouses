import { ipKeyGenerator } from 'express-rate-limit';

/** Stable IP-ish key for rate stores (Express `req.ip` with socket fallback). */
export const defaultIpKeyForReq = (req) => {
  const ip = req.ip ?? req.socket?.remoteAddress ?? '';
  return ipKeyGenerator(ip || '0.0.0.0');
};
