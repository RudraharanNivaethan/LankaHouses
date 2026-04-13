// [OLD CODE] import { comparePasswords } from '../utils/passwordUtils.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import { AppError, HTTP_STATUS } from '../utils/errorUtils.js';
import { CUSTOMER_REFRESH_JWT_SECRET, ADMIN_REFRESH_JWT_SECRET } from '../config/jwtConfig.js';
import { verifyFirebaseIdToken } from '../config/firebaseAdmin.js';

const SESSION_LIMIT_HOURS = 6;

// [OLD CODE] Classic brute-force constants — Firebase handles this now.
// const MAX_ATTEMPTS = 5;
// const LOCK_TIME = 15 * 60 * 1000;

// [OLD CODE] Brute-force helpers — Firebase handles this now.
// const handleFailedLogin = async (user) => {
//   user.loginAttempts += 1;
//   if (user.loginAttempts >= MAX_ATTEMPTS) {
//     user.lockUntil = new Date(Date.now() + LOCK_TIME);
//   }
//   await user.save();
// };
//
// const resetLoginAttempts = async (user) => {
//   if (user.loginAttempts > 0 || user.lockUntil) {
//     user.loginAttempts = 0;
//     user.lockUntil = undefined;
//     await user.save();
//   }
// };

// [OLD CODE] Classic register/login — superseded by Firebase authentication.
// export const register = async ({ name, email, phone, password }) => {
//   const existing = await User.findOne({ email });
//   if (existing) {
//     throw new AppError('Email already registered', HTTP_STATUS.CONFLICT);
//   }
//   const user = await User.create({ name, email, phone, password });
//   return user;
// };
//
// export const login = async (email, password) => {
//   const user = await User.findOne({ email }).select('+password');
//   if (!user) {
//     throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
//   }
//   if (user.lockUntil && user.lockUntil > Date.now()) {
//     const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
//     throw new AppError(
//       `Account locked. Try again in ${remainingMinutes} minute(s).`,
//       HTTP_STATUS.UNAUTHORIZED
//     );
//   }
//   const isMatch = await comparePasswords(password, user.password);
//   if (!isMatch) {
//     await handleFailedLogin(user);
//     throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
//   }
//   await resetLoginAttempts(user);
//   const accessToken  = generateAccessToken(user._id,  user.role, user.tokenVersion);
//   const refreshToken = generateRefreshToken(user._id, user.role, undefined, user.tokenVersion);
//   return { accessToken, refreshToken };
// };

export const verifyRefreshToken = async (token) => {
  if (!token) throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);

  const unverified = jwt.decode(token);
  if (!unverified?.role) throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);

  const secret = unverified.role === 'admin' ? ADMIN_REFRESH_JWT_SECRET : CUSTOMER_REFRESH_JWT_SECRET;

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch {
    throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
  }

  if (decoded.type !== 'refresh') throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
  if (!decoded.loginTime)         throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);

  // Enforce 6-hour absolute session limit
  const sessionDuration = (Date.now() - new Date(decoded.loginTime)) / 1000 / 3600;
  if (sessionDuration >= SESSION_LIMIT_HOURS) {
    throw new AppError('Session expired. Please login again.', HTTP_STATUS.UNAUTHORIZED);
  }

  // Server-side version check — rejects stolen/rotated-out tokens
  const user = await User.findById(decoded.id);
  if (!user || decoded.tokenVersion !== user.tokenVersion) {
    throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
  }

  // Rotate: increment version in DB then issue new tokens with the new version
  user.tokenVersion += 1;
  await user.save();

  const newVersion      = user.tokenVersion;
  const accessToken     = generateAccessToken(decoded.id, decoded.role, newVersion);
  const newRefreshToken = generateRefreshToken(decoded.id, decoded.role, decoded.loginTime, newVersion);

  return { accessToken, newRefreshToken };
};

export const firebaseRegister = async (idToken, name, phone) => {
  let decoded;
  try {
    decoded = await verifyFirebaseIdToken(idToken);
  } catch (err) {
    if (err.code === 'FIREBASE_NOT_CONFIGURED') {
      throw new AppError(
        'Server authentication is not configured. Add the Firebase service account JSON from Project settings → Service accounts → Generate new private key, and set FIREBASE_SERVICE_ACCOUNT_PATH in backend/.env.',
        HTTP_STATUS.SERVICE_UNAVAILABLE
      );
    }
    throw new AppError('Invalid Firebase token', HTTP_STATUS.UNAUTHORIZED);
  }

  const { uid, email } = decoded;

  const existing = await User.findOne({ $or: [{ firebase_uid: uid }, { email }] });
  if (existing) {
    throw new AppError('An account with this email already exists', HTTP_STATUS.CONFLICT);
  }

  const user = await User.create({
    name,
    email,
    phone,
    firebase_uid: uid,
    role: 'user',
  });

  const accessToken  = generateAccessToken(user._id,  user.role, user.tokenVersion);
  const refreshToken = generateRefreshToken(user._id, user.role, undefined, user.tokenVersion);

  return { accessToken, refreshToken };
};

export const firebaseExchange = async (idToken) => {
  let decoded;
  try {
    decoded = await verifyFirebaseIdToken(idToken);
  } catch (err) {
    if (err.code === 'FIREBASE_NOT_CONFIGURED') {
      throw new AppError(
        'Server authentication is not configured. Add the Firebase service account JSON from Project settings → Service accounts → Generate new private key, and set FIREBASE_SERVICE_ACCOUNT_PATH in backend/.env.',
        HTTP_STATUS.SERVICE_UNAVAILABLE
      );
    }
    throw new AppError('Invalid Firebase token', HTTP_STATUS.UNAUTHORIZED);
  }

  const { uid, email, name } = decoded;

  let user = await User.findOne({ firebase_uid: uid });

  if (!user) {
    user = await User.findOne({ email });
    if (user) {
      user.firebase_uid = uid;
      await user.save();
    } else {
      user = await User.create({
        name: name || email,
        email,
        firebase_uid: uid,
        role: 'user',
      });
    }
  }

  const accessToken  = generateAccessToken(user._id,  user.role, user.tokenVersion);
  const refreshToken = generateRefreshToken(user._id, user.role, undefined, user.tokenVersion);

  return { accessToken, refreshToken };
};
