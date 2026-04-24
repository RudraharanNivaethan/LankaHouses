export const ROLE = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
});

/**
 * Returns true for roles that should inherit all `admin` privileges.
 * This is the single shared definition used across routes, services, and middleware.
 */
export const isAdminLike = (role) => role === ROLE.ADMIN || role === ROLE.SUPERADMIN;

/**
 * Role hierarchy (highest first):
 *   superadmin > admin > user
 *
 * `superadmin` should satisfy checks for `admin` without duplicating admin-only logic.
 */
const ROLE_RANK = Object.freeze({
  [ROLE.USER]: 1,
  [ROLE.ADMIN]: 2,
  [ROLE.SUPERADMIN]: 3,
});

export const roleSatisfies = (actualRole, requiredRoles = []) => {
  if (!actualRole) return false;
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) return false;

  const actualRank = ROLE_RANK[actualRole];
  if (!actualRank) return false;

  for (const requiredRole of requiredRoles) {
    const requiredRank = ROLE_RANK[requiredRole];
    if (!requiredRank) continue;
    if (actualRank >= requiredRank) return true;
  }
  return false;
};

