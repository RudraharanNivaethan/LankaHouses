/**
 * Centralized role identifiers used for UI grouping only.
 *
 * The frontend MUST NOT derive any privilege decisions from the `role`
 * string. All capability checks must go through `user.permissions.*`, which
 * is produced by the backend (`backend/utils/permissions.js`). The backend
 * remains the sole authority for authorization.
 */
export const ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const

export type Role = (typeof ROLE)[keyof typeof ROLE]
