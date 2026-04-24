export const ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const

export type Role = (typeof ROLE)[keyof typeof ROLE]

/**
 * Role hierarchy (highest first):
 *   superadmin > admin > user
 *
 * Mirrors backend/utils/roleUtils.js — frontend uses this solely for UI
 * routing and rendering decisions. Backend remains the authoritative source
 * of all actual permission enforcement.
 */
const ROLE_RANK: Record<string, number> = {
  [ROLE.USER]: 1,
  [ROLE.ADMIN]: 2,
  [ROLE.SUPERADMIN]: 3,
}

/**
 * Returns true for roles that inherit all admin-level UI access.
 * Use this instead of `role === 'admin'` everywhere in the frontend.
 */
export const isAdminLike = (role?: string | null): boolean =>
  role === ROLE.ADMIN || role === ROLE.SUPERADMIN

/**
 * Returns true when actualRole satisfies at least one of the required roles
 * via the hierarchy (e.g. superadmin satisfies an admin requirement).
 */
export const roleSatisfies = (
  actualRole: string | null | undefined,
  requiredRoles: string[],
): boolean => {
  if (!actualRole) return false
  const rank = ROLE_RANK[actualRole]
  if (!rank) return false
  return requiredRoles.some((r) => rank >= (ROLE_RANK[r] ?? Infinity))
}
