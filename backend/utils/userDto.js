import { getPermissionsForRole, getDisplayRoleForRole } from './permissions.js';

/**
 * Shapes a Mongoose user document into the public payload returned to the
 * frontend. Strips internal fields (`password`, `firebase_uid`,
 * `tokenVersion`, `__v`) and attaches:
 *
 *  - `displayRole`   — human-readable label, top-level (not inside permissions)
 *  - `permissions`   — flat string[] of PERMISSION.XXX keys the user holds;
 *                      frontend consumes these via `user.permissions.includes(key)`
 *
 * Accepts a Mongoose document or any plain object with matching fields.
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
    displayRole: getDisplayRoleForRole(plain.role),
    createdAt:   plain.createdAt,
    updatedAt:   plain.updatedAt,
    permissions: [...getPermissionsForRole(plain.role)],
  };
};
