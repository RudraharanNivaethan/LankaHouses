export type UserRole = 'admin' | 'superadmin' | 'user'

/**
 * Backend-supplied capability flags. The frontend MUST only read these — it
 * must never compute them from the raw `role` string. Backend (see
 * `backend/utils/permissions.js`) remains the source of truth.
 */
export interface UserPermissions {
  displayRole: string
  canAccessAdminPanel: boolean
  canManageProperties: boolean
  canManageInquiries: boolean
  canAccessSuperAdminPanel: boolean
  canViewAllUsers: boolean
  canCreateAdmin: boolean
  canViewUserRoleStats: boolean
}

export interface User {
  _id: string
  name: string
  email: string
  phone?: string | null
  role: UserRole
  createdAt?: string
  updatedAt?: string
  permissions: UserPermissions
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
