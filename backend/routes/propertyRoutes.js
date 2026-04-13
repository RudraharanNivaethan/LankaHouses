import { Router } from 'express';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/authMiddleware.js';
import {
  propertyListReadLimiters,
  propertyListSearchTieredLimiters,
  propertyByIdReadLimiters,
  propertyCreateDualLimiters,
  propertyModifyDualLimiters,
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
  ...propertyCreateDualLimiters,
  ...propertyUploadBundle,
  requireImages,
  validateBody(createPropertySchema),
  createProperty
);

router.get(
  '/',
  optionalAuthenticate,
  ...propertyListReadLimiters,
  ...propertyListSearchTieredLimiters,
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
  optionalAuthenticate,
  ...propertyByIdReadLimiters,
  validateParams(propertyIdParamsSchema),
  getPropertyById
);

router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  ...propertyModifyDualLimiters,
  validateParams(propertyIdParamsSchema),
  validateBody(updatePropertySchema),
  updateProperty
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  ...propertyModifyDualLimiters,
  validateParams(propertyIdParamsSchema),
  deleteProperty
);

router.post(
  '/:id/images',
  authenticate,
  authorize('admin'),
  ...propertyModifyDualLimiters,
  validateParams(propertyIdParamsSchema),
  ...propertyUploadBundle,
  requireImages,
  addImages
);

router.delete(
  '/:id/images/:imageIndex',
  authenticate,
  authorize('admin'),
  ...propertyModifyDualLimiters,
  validateParams(propertyImageIndexSchema),
  deleteImage
);

export default router;
