export type UserRole = 'admin' | 'superadmin' | 'user'

/**
 * A user as returned by `toPublicUser()` on the backend.
 *
 * `permissions` is a flat string[] of permission key values defined and
 * owned entirely by the backend (`backend/utils/permissionKeys.js`).
 * All access-control checks must use `user.permissions.includes('key.string')`.
 * `displayRole` is a human-readable label only — never used for routing/auth decisions.
 * `role` is identity-only — never used for access-control decisions.
 */
export interface User {
  _id: string
  name: string
  email: string
  phone?: string | null
  role: UserRole
  displayRole: string
  createdAt?: string
  updatedAt?: string
  permissions: string[]
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  phone?: string
  password: string
}

export interface AuthApiResponse {
  success: boolean
  message: string
}

export interface MeApiResponse {
  success: boolean
  data: User
}

export interface UserRoleStats {
  totalUsers: number
  totalAdmins: number
  totalSuperAdmins: number
}

export interface UserRoleStatsApiResponse {
  success: boolean
  data: UserRoleStats
}

export interface UsersApiResponse {
  success: boolean
  data: User[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CreateAdminPayload {
  name: string
  email: string
  password: string
}

export interface CreateAdminApiResponse {
  success: boolean
  data: User
}
