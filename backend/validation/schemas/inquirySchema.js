/**
 * Inquiry Validation Schemas
 */

import { z } from 'zod';
import { INQUIRY_TYPES, INQUIRY_STATUSES } from '../../models/Inquiry.js';
import { sanitizeString, trimString } from '../sanitizers.js';
import { searchQueryField } from '../search/mongoSafeSearchQuery.js';

const inquiryTypeField  = z.enum(INQUIRY_TYPES,    { error: `Inquiry type must be one of: ${INQUIRY_TYPES.join(', ')}` });
const statusField       = z.enum(INQUIRY_STATUSES, { error: `Status must be one of: ${INQUIRY_STATUSES.join(', ')}` });

const titleField      = z.string({ required_error: 'Title is required' })
  .transform(sanitizeString)
  .refine((val) => val.length >= 1,   { message: 'Title cannot be empty' })
  .refine((val) => val.length <= 200, { message: 'Title must be at most 200 characters' });

const messageField    = z.string({ required_error: 'Message is required' })
  .transform(trimString)
  .refine((val) => val.length >= 1,    { message: 'Message cannot be empty' })
  .refine((val) => val.length <= 5000, { message: 'Message must be at most 5000 characters' });

const adminReplyField = z.string({ required_error: 'Admin reply is required' })
  .transform(trimString)
  .refine((val) => val.length >= 1,    { message: 'Admin reply cannot be empty' })
  .refine((val) => val.length <= 5000, { message: 'Admin reply must be at most 5000 characters' });

const objectIdField = (label) =>
  z.string().regex(/^[a-f\d]{24}$/i, `Invalid ${label} ID`);

/**
 * User submits a new inquiry.
 * Cross-field rule: GENERAL → propertyId must be absent/null; PROPERTY → propertyId required.
 */
export const createInquirySchema = z
  .object({
    inquiryType: inquiryTypeField,
    title:       titleField,
    message:     messageField,
    propertyId:  objectIdField('property').nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.inquiryType === 'GENERAL' && data.propertyId != null) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['propertyId'],
        message: 'propertyId must be null for GENERAL inquiries',
      });
    }
    if (data.inquiryType === 'PROPERTY' && data.propertyId == null) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['propertyId'],
        message: 'propertyId is required for PROPERTY inquiries',
      });
    }
  });

/**
 * Body for the route-split creation endpoints (POST /general, POST /property/:propertyId).
 * inquiryType and propertyId are implicit in the URL — not sent in the body.
 */
export const inquiryBodySchema = z.object({
  title:   titleField,
  message: messageField,
});

/**
 * Admin posts a reply to an inquiry.
 * Service layer is responsible for setting repliedAt and status → REPLIED.
 */
export const adminReplySchema = z.object({
  adminReply: adminReplyField,
});

/**
 * Filter/list inquiries — admin view (full filter surface).
 */
export const inquiryQuerySchema = z.object({
  inquiryType: inquiryTypeField.optional(),
  status:      statusField.optional(),
  userId:      objectIdField('user').optional(),
  propertyId:  objectIdField('property').optional(),
  search:      searchQueryField,
  page:        z.coerce.number().int().min(1, 'Page must be at least 1').optional().default(1),
  limit:       z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').optional().default(20),
});

/**
 * Filter/list inquiries — user view (userId is forced server-side, not a query param).
 */
export const myInquiryQuerySchema = z.object({
  inquiryType: inquiryTypeField.optional(),
  status:      statusField.optional(),
  search:      searchQueryField,
  page:        z.coerce.number().int().min(1, 'Page must be at least 1').optional().default(1),
  limit:       z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').optional().default(20),
});

/**
 * Validates the :inquiryId route param for single-inquiry endpoints.
 */
export const inquiryIdParamsSchema = z.object({
  inquiryId: objectIdField('inquiry'),
});

/**
 * Validates the :propertyId route param for POST /inquiries/property/:propertyId.
 */
export const inquiryPropertyParamsSchema = z.object({
  propertyId: objectIdField('property'),
});
