import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { PERMISSION } from '../utils/permissionKeys.js';
import { validateBody, validateParams, validateQuery } from '../validation/validationMiddleware.js';
import {
  inquiryQuerySchema,
  inquiryIdParamsSchema,
  adminReplySchema,
} from '../validation/schemas/inquirySchema.js';
import {
  adminInquiryReadLimiter,
  adminInquiryModifyLimiter,
} from '../middleware/rateLimitMiddleware.js';
import {
  getAdminInquiries,
  getAdminInquiryById,
  replyToInquiry,
  closeInquiry,
} from '../controllers/inquiryController.js';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize(PERMISSION.INQUIRIES_MANAGE),
  adminInquiryReadLimiter,
  validateQuery(inquiryQuerySchema),
  getAdminInquiries
);

router.get(
  '/:inquiryId',
  authenticate,
  authorize(PERMISSION.INQUIRIES_MANAGE),
  adminInquiryReadLimiter,
  validateParams(inquiryIdParamsSchema),
  getAdminInquiryById
);

router.patch(
  '/:inquiryId/reply',
  authenticate,
  authorize(PERMISSION.INQUIRIES_MANAGE),
  adminInquiryModifyLimiter,
  validateParams(inquiryIdParamsSchema),
  validateBody(adminReplySchema),
  replyToInquiry
);

router.patch(
  '/:inquiryId/close',
  authenticate,
  authorize(PERMISSION.INQUIRIES_MANAGE),
  adminInquiryModifyLimiter,
  validateParams(inquiryIdParamsSchema),
  closeInquiry
);

export default router;
