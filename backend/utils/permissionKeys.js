/**
 * Canonical permission key constants.
 *
 * These strings are the ONLY authorization vocabulary in the system.
 * - Backend `authorize()` middleware checks against these keys.
 * - Backend `getPermissionsForRole()` grants these keys per role.
 * - Frontend `user.permissions.includes('key.string')` reads them.
 *
 * Naming convention: `resource.action` (dot-separated, lowercase).
 * All keys represent capabilities — what a user CAN DO — never who they ARE.
 * Role identity is handled separately by `roleUtils.js` and is NEVER used
 * at runtime for authorization decisions.
 */
export const PERMISSION = Object.freeze({
  // Capabilities granted to regular users
  INQUIRIES_SUBMIT:      'inquiries.submit',

  // Capabilities granted to admin + superadmin
  PROPERTIES_MANAGE:     'properties.manage',
  PROPERTIES_STATS_READ: 'properties.stats.read',
  INQUIRIES_MANAGE:      'inquiries.manage',

  // Capabilities granted to superadmin only
  USERS_READ:            'users.read',
  USERS_STATS_READ:      'users.stats.read',
  ADMINS_CREATE:         'admins.create',
});
