import firebaseAdmin from '../config/firebaseAdmin.js';
import User from '../models/User.js';
import { AppError, HTTP_STATUS } from '../utils/errorUtils.js';

const DEFAULT_PAGE  = 1;
const DEFAULT_LIMIT = 20;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Returns a paginated list of users, optionally filtered by role.
 */
export const listUsers = async ({
  role,
  search,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
} = {}) => {
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    const rx = new RegExp(escapeRegExp(search), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }

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

const SUGGEST_MAX = 10;

/**
 * Returns up to `limit` autocomplete suggestion strings for the given query.
 * Matches against user name and email (case-insensitive substring).
 */
export const getUserSuggestions = async (q, limit = 8) => {
  if (!q || !q.trim()) return [];
  const rx = new RegExp(escapeRegExp(q.trim()), 'i');
  const cap = Math.min(limit, SUGGEST_MAX);

  const [names, emails] = await Promise.all([
    User.distinct('name',  { name:  rx }),
    User.distinct('email', { email: rx }),
  ]);

  const merged = [...new Set([...names, ...emails])];
  merged.sort((a, b) => a.localeCompare(b));
  return merged.slice(0, cap);
};

/**
 * Returns a single user by their MongoDB _id.
 * Throws AppError 404 if no user with that id exists.
 */
export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }
  return user;
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
