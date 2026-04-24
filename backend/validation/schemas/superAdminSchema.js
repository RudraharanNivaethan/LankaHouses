import { z } from 'zod';
import validator from 'validator';
import { sanitizeString, normalizeEmail, isStrongPassword } from '../sanitizers.js';

export const listUsersQuerySchema = z.object({
  role:  z.enum(['user', 'admin', 'superadmin']).optional(),
  search: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : sanitizeString(val)))
    .transform((val) => {
      if (val === undefined) return undefined;
      const trimmed = val.trim();
      if (!trimmed) return undefined;
      return trimmed.length > 150 ? trimmed.slice(0, 150) : trimmed;
    }),
  page:  z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const createAdminSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .transform(sanitizeString)
    .refine((val) => val.length >= 2, { message: 'Name must be at least 2 characters' })
    .refine((val) => val.length <= 100, { message: 'Name must be at most 100 characters' }),
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .transform(normalizeEmail)
    .refine((val) => validator.isEmail(val), { message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .refine(isStrongPassword, {
      message: 'Password must be at least 12 characters with uppercase, lowercase, number, and symbol',
    }),
});
