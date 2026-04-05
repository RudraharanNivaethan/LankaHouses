import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required'),
})

// Mirrors backend registerSchema in backend/validation/schemas/authSchema.js
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  phone: z
    .string()
    .regex(
      /^(?:\+94|0)[0-9]{9}$/,
      'Enter a valid Sri Lankan number (e.g. 0712345678 or +94712345678)',
    )
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one symbol'),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  phone: z
    .string()
    .regex(
      /^(?:\+94|0)[0-9]{9}$/,
      'Enter a valid Sri Lankan number (e.g. 0712345678 or +94712345678)',
    )
    .optional()
    .or(z.literal('')),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
