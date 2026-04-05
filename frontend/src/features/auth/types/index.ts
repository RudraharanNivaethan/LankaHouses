export type UserRole = 'admin' | 'user'

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: UserRole
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
