import type { User } from '../types/auth'

/**
 * Returns true if the user holds the given backend-defined permission key.
 *
 * Handles null / undefined users safely.
 * The permission strings are owned exclusively by the backend registry
 * (`backend/utils/permissionKeys.js`). Never import or re-define them here.
 */
export function can(user: User | null | undefined, permission: string): boolean {
  return user?.permissions.includes(permission) ?? false
}
