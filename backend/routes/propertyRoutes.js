import { Router } from 'express';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/authMiddleware.js';
import {
  propertyListReadLimiter,
  propertyListSearchTieredLimiter,
  propertyByIdReadLimiter,
  propertyCreateLimiter,
  propertyModifyLimiter,
} from '../middleware/rateLimitMiddleware.js';
import { validateBody, validateParams, validateQuery } from '../validation/validationMiddleware.js';
import {
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
  propertyIdParamsSchema,
  propertyImageIndexSchema,
} from '../validation/schemas/propertySchema.js';
import { propertyUploadBundle, requireImages } from '../middleware/uploadMiddleware.js';
import {
  createProperty,
  getAdminListingStats,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  addImages,
  deleteImage,
} from '../controllers/propertyController.js';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('admin'),
  propertyCreateLimiter,
  ...propertyUploadBundle,
  requireImages,
  validateBody(createPropertySchema),
  createProperty
);

router.get(
  '/',
  optionalAuthenticate,
  propertyListReadLimiter,
  propertyListSearchTieredLimiter,
  validateQuery(propertyQuerySchema),
  getProperties
);

router.get(
  '/stats/listings',
  authenticate,
  authorize('admin'),
  getAdminListingStats
);

router.get(
  '/:id',
  propertyByIdReadLimiter,
  validateParams(propertyIdParamsSchema),
  getPropertyById
);

router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  propertyModifyLimiter,
  validateParams(propertyIdParamsSchema),
  validateBody(updatePropertySchema),
  updateProperty
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  propertyModifyLimiter,
  validateParams(propertyIdParamsSchema),
  deleteProperty
);

router.post(
  '/:id/images',
  authenticate,
  authorize('admin'),
  propertyModifyLimiter,
  validateParams(propertyIdParamsSchema),
  ...propertyUploadBundle,
  requireImages,
  addImages
);

router.delete(
  '/:id/images/:imageIndex',
  authenticate,
  authorize('admin'),
  propertyModifyLimiter,
  validateParams(propertyImageIndexSchema),
  deleteImage
);

export default router;
