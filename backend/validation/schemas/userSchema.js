import { z } from 'zod';
import validator from 'validator';
import { normalizeSriLankanPhone, sanitizeString } from '../sanitizers.js';

const nameField = z
  .string()
  .min(1, 'Name cannot be empty')
  .transform(sanitizeString)
  .refine((val) => val.length >= 2, { message: 'Name must be at least 2 characters' })
  .refine((val) => val.length <= 100, { message: 'Name must be at most 100 characters' });

const phoneField = z
  .string()
  .min(1, 'Phone cannot be empty')
  .transform(normalizeSriLankanPhone)
  .refine((val) => validator.isMobilePhone(val, 'si-LK'), { message: 'Invalid phone number' });

export const updateProfileSchema = z
  .object({
    name:  nameField.optional(),
    phone: phoneField.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.name === undefined && data.phone === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field (name or phone) is required',
      });
    }
  });
