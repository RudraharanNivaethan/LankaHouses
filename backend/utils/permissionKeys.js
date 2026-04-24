/**
 * Canonical permission key constants.
 *
 * These strings are the ONLY authorization vocabulary in the system.
 * - Backend `authorize()` middleware checks against these keys.
 * - Backend `getPermissionsForRole()` grants these keys per role.
 * - Frontend `user.permissions.includes(PERMISSION.XXX)` reads them.
 *
 * The frontend mirrors this file at `frontend/src/constants/permissionKeys.ts`.
 * Both sides MUST stay in sync — any new key is added here first, then mirrored.
 *
 * Naming convention: `resource.action` (dot-separated, lowercase).
 */
export const PERMISSION = Object.freeze({
  // Admin-level (granted to: admin, superadmin)
  ADMIN_ACCESS:          'admin.access',
  PROPERTIES_MANAGE:     'properties.manage',
  PROPERTIES_STATS_READ: 'properties.stats.read',
  INQUIRIES_MANAGE:      'inquiries.manage',

  // Superadmin-only
  SUPERADMIN_ACCESS:     'superadmin.access',
  USERS_READ:            'users.read',
  USERS_STATS_READ:      'users.stats.read',
  ADMINS_CREATE:         'admins.create',
});
