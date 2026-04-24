import { ROLE, isAdminLike, roleSatisfies } from './roleUtils.js';

/**
 * Human-readable labels for each role. Used by the frontend for display only;
 * NEVER use these for authorization decisions.
 */
const ROLE_DISPLAY = Object.freeze({
  [ROLE.USER]:       'User',
  [ROLE.ADMIN]:      'Administrator',
  [ROLE.SUPERADMIN]: 'Super Administrator',
});

/**
 * Builds the capability object exposed to clients for a given role.
 *
 * This is the single backend source of truth for UI-facing capability flags.
 * Flags are derived from the existing `isAdminLike` / `roleSatisfies` helpers
 * so that HTTP authorization (`authorize(...)`) and the permissions payload
 * stay in lock-step. Frontend consumers MUST treat this object as read-only
 * UX guidance — real authorization still happens on protected endpoints.
 */
export const getPermissionsForRole = (role) =>
  Object.freeze({
    displayRole:              ROLE_DISPLAY[role] ?? ROLE_DISPLAY[ROLE.USER],

    canAccessAdminPanel:      isAdminLike(role),
    canManageProperties:      isAdminLike(role),
    canManageInquiries:       isAdminLike(role),

    canAccessSuperAdminPanel: roleSatisfies(role, [ROLE.SUPERADMIN]),
    canViewAllUsers:          roleSatisfies(role, [ROLE.SUPERADMIN]),
    canCreateAdmin:           roleSatisfies(role, [ROLE.SUPERADMIN]),
    canViewUserRoleStats:     roleSatisfies(role, [ROLE.SUPERADMIN]),
  });
