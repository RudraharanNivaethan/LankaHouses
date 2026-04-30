import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { PERMISSION } from '../utils/permissionKeys.js';
import { validateBody, validateParams, validateQuery } from '../validation/validationMiddleware.js';
import {
  inquiryBodySchema,
  inquiryPropertyParamsSchema,
  inquiryIdParamsSchema,
  myInquiryQuerySchema,
} from '../validation/schemas/inquirySchema.js';
import {
  inquiryCreateLimiter,
  inquiryReadLimiter,
} from '../middleware/rateLimitMiddleware.js';
import {
  createGeneralInquiry,
  createPropertyInquiry,
  getUserInquiries,
  getUserInquiryById,
} from '../controllers/inquiryController.js';

const router = Router();

router.post(
  '/general',
  authenticate,
  authorize(PERMISSION.INQUIRIES_SUBMIT),
  inquiryCreateLimiter,
  validateBody(inquiryBodySchema),
  createGeneralInquiry
);

router.post(
  '/property/:propertyId',
  authenticate,
  authorize(PERMISSION.INQUIRIES_SUBMIT),
  inquiryCreateLimiter,
  validateParams(inquiryPropertyParamsSchema),
  validateBody(inquiryBodySchema),
  createPropertyInquiry
);

router.get(
  '/my',
  authenticate,
  authorize(PERMISSION.INQUIRIES_SUBMIT),
  inquiryReadLimiter,
  validateQuery(myInquiryQuerySchema),
  getUserInquiries
);

router.get(
  '/my/:inquiryId',
  authenticate,
  authorize(PERMISSION.INQUIRIES_SUBMIT),
  inquiryReadLimiter,
  validateParams(inquiryIdParamsSchema),
  getUserInquiryById
);

export default router;
