import { getPermissionsForRole } from './permissions.js';

/**
 * Shapes a Mongoose user document (or plain object) into the public payload
 * returned to the frontend. Strips private / internal fields such as
 * `password`, `firebase_uid`, `tokenVersion`, and `__v`, and attaches the
 * backend-derived `permissions` object so the client never has to compute
 * privileges from the role string.
 *
 * Accepts a Mongoose document or any object with matching fields.
 */
export const toPublicUser = (user) => {
  if (!user) return null;

  const plain = typeof user.toObject === 'function'
    ? user.toObject({ virtuals: false })
    : user;

  return {
    _id:         plain._id?.toString?.() ?? plain._id,
    name:        plain.name,
    email:       plain.email,
    phone:       plain.phone ?? null,
    role:        plain.role,
    createdAt:   plain.createdAt,
    updatedAt:   plain.updatedAt,
    permissions: getPermissionsForRole(plain.role),
  };
};
