import type { UserRole } from '../types/auth'

/**
 * All role string literals the frontend understands. Must stay aligned with
 * the backend enum in `backend/models/User.js`. This is the single source of
 * truth for role literals on the frontend — do not inline string comparisons
 * elsewhere.
 */
export const ROLE_VALUES: readonly UserRole[] = ['user', 'admin', 'superadmin'] as const

/** Type guard for an unknown string being a valid `UserRole`. */
export function isUserRole(value: string | null | undefined): value is UserRole {
  return value === 'user' || value === 'admin' || value === 'superadmin'
}

/**
 * UI options for filtering users by role. Used by the role filter pill group
 * on `AdminUsersPage`. These are display-only labels; capability decisions
 * come from `user.permissions` supplied by the backend.
 */
export interface RoleFilterOption {
  label: string
  value: UserRole | undefined
}

export const ROLE_OPTIONS: RoleFilterOption[] = [
  { label: 'All',         value: undefined },
  { label: 'Users',       value: 'user' },
  { label: 'Admins',      value: 'admin' },
  { label: 'Superadmins', value: 'superadmin' },
]
