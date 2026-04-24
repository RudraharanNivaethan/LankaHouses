import { PERMISSION } from './permissionKeys.js';

/**
 * Human-readable role labels. Used exclusively for display; NEVER for
 * authorization decisions.
 */
const ROLE_DISPLAY = Object.freeze({
  user:       'User',
  admin:      'Administrator',
  superadmin: 'Super Administrator',
});

/**
 * Permissions granted to all admin-like roles (admin + superadmin).
 * Extend this array to add a new capability that both roles share.
 */
const ADMIN_PERMISSIONS = Object.freeze([
  PERMISSION.ADMIN_ACCESS,
  PERMISSION.PROPERTIES_MANAGE,
  PERMISSION.PROPERTIES_STATS_READ,
  PERMISSION.INQUIRIES_MANAGE,
]);

/**
 * Additional permissions exclusive to superadmin.
 * Extend this array to add a new superadmin-only capability.
 */
const SUPERADMIN_EXTRA_PERMISSIONS = Object.freeze([
  PERMISSION.SUPERADMIN_ACCESS,
  PERMISSION.USERS_READ,
  PERMISSION.USERS_STATS_READ,
  PERMISSION.ADMINS_CREATE,
]);

const SUPERADMIN_PERMISSIONS = Object.freeze([
  ...ADMIN_PERMISSIONS,
  ...SUPERADMIN_EXTRA_PERMISSIONS,
]);

/**
 * Returns the flat permission key array for a given role.
 *
 * This is the single backend source of truth for what a role can do.
 * Role hierarchy ("superadmin inherits admin") is expressed by sharing
 * ADMIN_PERMISSIONS — no rank comparison, no isAdminLike(), no roleSatisfies().
 *
 * Adding a new capability only requires:
 *   1. Add key to permissionKeys.js
 *   2. Add it to the appropriate array above
 *   3. Use it in authorize() and on the frontend — nothing else changes
 */
export const getPermissionsForRole = (role) => {
  if (role === 'superadmin') return SUPERADMIN_PERMISSIONS;
  if (role === 'admin')      return ADMIN_PERMISSIONS;
  return Object.freeze([]);
};

/**
 * Returns the human-readable display label for a role.
 * For the frontend subtitle / user-facing identity only.
 */
export const getDisplayRoleForRole = (role) => ROLE_DISPLAY[role] ?? ROLE_DISPLAY.user;
