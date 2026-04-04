import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import { AppError, HTTP_STATUS } from '../utils/errorUtils.js';

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes
const SESSION_LIMIT_HOURS = 6;

const handleFailedLogin = async (user) => {
  user.loginAttempts += 1;
  if (user.loginAttempts >= MAX_ATTEMPTS) {
    user.lockUntil = new Date(Date.now() + LOCK_TIME);
  }
  await user.save();
};

const resetLoginAttempts = async (user) => {
  if (user.loginAttempts > 0 || user.lockUntil) {
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
  }
};

export const register = async ({ name, email, phone, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('Email already registered', HTTP_STATUS.CONFLICT);
  }
  const user = await User.create({ name, email, phone, password });
  return user;
};

export const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.lockUntil && user.lockUntil > Date.now()) {
    const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new AppError(
      `Account locked. Try again in ${remainingMinutes} minute(s).`,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  const isMatch = await argon2.verify(user.password, password);
  if (!isMatch) {
    await handleFailedLogin(user);
    throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
  }

  await resetLoginAttempts(user);

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token) => {
  if (!token) {
    throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
  }

  let decoded;

  // Try user secret first, then admin secret
  try {
    decoded = jwt.verify(token, process.env.CUSTOMER_REFRESH_JWT_SECRET);
  } catch {
    try {
      decoded = jwt.verify(token, process.env.ADMIN_REFRESH_JWT_SECRET);
    } catch {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  // Enforce 6-hour absolute session limit
  const sessionDuration = (Date.now() - new Date(decoded.loginTime)) / 1000 / 3600;
  if (sessionDuration >= SESSION_LIMIT_HOURS) {
    throw new AppError('Session expired. Please login again.', HTTP_STATUS.UNAUTHORIZED);
  }

  // Issue new tokens, preserving original loginTime for absolute timeout
  const accessToken = generateAccessToken(decoded.id, decoded.role);
  const newRefreshToken = generateRefreshToken(decoded.id, decoded.role, decoded.loginTime);

  return { accessToken, newRefreshToken };
};
