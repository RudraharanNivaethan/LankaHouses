import jwt from 'jsonwebtoken';
import {
  getAccessJwtSecretForRole,
  getRefreshJwtSecretForRole,
} from '../config/jwtConfig.js';

export const generateAccessToken = (userId, role = 'user', tokenVersion = 0) => {
  const secret = getAccessJwtSecretForRole(role);
  return jwt.sign(
    { id: userId, role, tokenVersion },
    secret,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (userId, role = 'user', loginTime = null, tokenVersion = 0) => {
  const secret = getRefreshJwtSecretForRole(role);
  const sessionStart = loginTime || new Date().toISOString();
  return jwt.sign(
    { id: userId, role, type: 'refresh', loginTime: sessionStart, tokenVersion },
    secret,
    { expiresIn: '6h' }
  );
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 min
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 6 * 60 * 60 * 1000 // 6 hours
  });
};

export const clearAuthCookies = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const options = { httpOnly: true, secure: isProd, sameSite: 'strict' };
  res.clearCookie('token', options);
  res.clearCookie('refreshToken', options);
};
