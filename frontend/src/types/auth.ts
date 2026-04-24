export type UserRole = 'admin' | 'superadmin' | 'user'

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  createdAt?: string
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
