import { Router } from 'express';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/authMiddleware.js';
import { PERMISSION } from '../utils/permissionKeys.js';
import {
  propertyListReadLimiter,
  propertyListSearchLimiter,
  propertyByIdReadLimiter,
  propertyCreateLimiter,
  propertyModifyLimiter,
  propertyStatsLimiter,
  propertyMetaLimiter,
  propertySuggestLimiter,
} from '../middleware/rateLimitMiddleware.js';
import { validateBody, validateParams, validateQuery } from '../validation/validationMiddleware.js';
import {
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
  propertySuggestQuerySchema,
  propertyIdParamsSchema,
  propertyImageIndexSchema,
} from '../validation/schemas/propertySchema.js';
import { propertyUploadBundle, requireImages } from '../middleware/uploadMiddleware.js';
import {
  createProperty,
  getAdminListingStats,
  getPropertyStatuses,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  addImages,
  deleteImage,
  suggestProperties,
} from '../controllers/propertyController.js';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(PERMISSION.PROPERTIES_MANAGE),
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
  propertyListSearchLimiter,
  validateQuery(propertyQuerySchema),
  getProperties
);

router.get(
  '/stats/listings',
  authenticate,
  authorize(PERMISSION.PROPERTIES_STATS_READ),
  propertyStatsLimiter,
  getAdminListingStats
);

router.get(
  '/meta/statuses',
  authenticate,
  authorize(PERMISSION.PROPERTIES_STATS_READ),
  propertyMetaLimiter,
  getPropertyStatuses
);

router.get(
  '/suggest',
  optionalAuthenticate,
  propertySuggestLimiter,
  validateQuery(propertySuggestQuerySchema),
  suggestProperties,
);

router.get(
  '/:id',
  optionalAuthenticate,
  propertyByIdReadLimiter,
  validateParams(propertyIdParamsSchema),
  getPropertyById
);

router.patch(
  '/:id',
  authenticate,
  authorize(PERMISSION.PROPERTIES_MANAGE),
  propertyModifyLimiter,
  validateParams(propertyIdParamsSchema),
  validateBody(updatePropertySchema),
  updateProperty
);

router.delete(
  '/:id',
  authenticate,
  authorize(PERMISSION.PROPERTIES_MANAGE),
  propertyModifyLimiter,
  validateParams(propertyIdParamsSchema),
  deleteProperty
);

router.post(
  '/:id/images',
  authenticate,
  authorize(PERMISSION.PROPERTIES_MANAGE),
  propertyModifyLimiter,
  validateParams(propertyIdParamsSchema),
  ...propertyUploadBundle,
  requireImages,
  addImages
);

router.delete(
  '/:id/images/:imageIndex',
  authenticate,
  authorize(PERMISSION.PROPERTIES_MANAGE),
  propertyModifyLimiter,
  validateParams(propertyImageIndexSchema),
  deleteImage
);

export default router;
