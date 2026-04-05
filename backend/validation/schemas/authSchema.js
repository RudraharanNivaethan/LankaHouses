/**
 * Authentication Validation Schemas
 */

import { z } from 'zod';
import validator from 'validator';
import { normalizeEmail, normalizeSriLankanPhone, sanitizeString } from '../sanitizers.js';

// [OLD CODE] Classic login schema — used only by POST /login (superseded by Firebase).
// export const loginSchema = z.object({
//   email: z
//     .string({ required_error: 'Email is required' })
//     .min(1, 'Email is required')
//     .transform(normalizeEmail)
//     .refine((val) => validator.isEmail(val), { message: 'Invalid email format' }),
//   password: z
//     .string({ required_error: 'Password is required' })
//     .min(1, 'Password is required')
// });

// [OLD CODE] Classic register schema — used only by POST /register (superseded by Firebase).
// export const registerSchema = z.object({
//   name: z
//     .string({ required_error: 'Name is required' })
//     .min(1, 'Name is required')
//     .transform(sanitizeString)
//     .refine((val) => val.length >= 2, { message: 'Name must be at least 2 characters' })
//     .refine((val) => val.length <= 100, { message: 'Name must be at most 100 characters' }),
//   email: z
//     .string({ required_error: 'Email is required' })
//     .min(1, 'Email is required')
//     .transform(normalizeEmail)
//     .refine((val) => validator.isEmail(val), { message: 'Invalid email' }),
//   phone: z
//     .string({ required_error: 'Phone is required' })
//     .min(1, 'Phone is required')
//     .transform(normalizeSriLankanPhone)
//     .refine((val) => validator.isMobilePhone(val, 'si-LK'), { message: 'Invalid phone number' }),
//   password: z
//     .string({ required_error: 'Password is required' })
//     .min(1, 'Password is required')
//     .refine(
//       (val) => validator.isStrongPassword(val, {
//         minLength: 12,
//         minSymbols: 1,
//         minLowercase: 1,
//         minUppercase: 1,
//         minNumbers: 1
//       }),
//       { message: 'Password must be at least 12 characters with uppercase, lowercase, number, and symbol' }
//     )
// });

/**
 * Firebase registration schema
 * - idToken: Firebase ID token issued after createUserWithEmailAndPassword
 * - name: sanitized display name
 * - phone: normalized Sri Lankan phone number
 * Password is owned by Firebase; we never receive it.
 */
export const firebaseRegisterSchema = z.object({
  idToken: z
    .string({ required_error: 'idToken is required' })
    .min(1, 'idToken is required'),
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .transform(sanitizeString)
    .refine((val) => val.length >= 2, { message: 'Name must be at least 2 characters' })
    .refine((val) => val.length <= 100, { message: 'Name must be at most 100 characters' }),
  phone: z
    .string({ required_error: 'Phone is required' })
    .min(1, 'Phone is required')
    .transform(normalizeSriLankanPhone)
    .refine((val) => validator.isMobilePhone(val, 'si-LK'), { message: 'Invalid phone number' }),
});
