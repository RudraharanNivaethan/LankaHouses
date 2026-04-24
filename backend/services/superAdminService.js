import firebaseAdmin from '../config/firebaseAdmin.js';
import User from '../models/User.js';
import { AppError, HTTP_STATUS } from '../utils/errorUtils.js';

const DEFAULT_PAGE  = 1;
const DEFAULT_LIMIT = 20;

/**
 * Returns a paginated list of users, optionally filtered by role.
 */
export const listUsers = async ({ role, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = {}) => {
  const filter = {};
  if (role) filter.role = role;

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Returns the total number of users grouped by role.
 */
export const getUserRoleStats = async () => {
  const [totalUsers, totalAdmins, totalSuperAdmins] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ role: 'superadmin' }),
  ]);
  return { totalUsers, totalAdmins, totalSuperAdmins };
};

/**
 * Creates a new admin user in both Firebase and MongoDB.
 * Throws AppError 409 if the email is already registered in either system.
 */
export const createAdminUser = async ({ name, email, password }) => {
  const existingMongoUser = await User.findOne({ email });
  if (existingMongoUser) {
    throw new AppError('An account with this email already exists', HTTP_STATUS.CONFLICT);
  }

  let firebaseUid;
  try {
    const fbUser = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName: name,
    });
    firebaseUid = fbUser.uid;
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      throw new AppError('An account with this email already exists', HTTP_STATUS.CONFLICT);
    }
    throw err;
  }

  const user = await User.create({
    name,
    email,
    firebase_uid: firebaseUid,
    role: 'admin',
  });

  return user;
};
