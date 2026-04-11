import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
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
  ...propertyUploadBundle,
  requireImages,
  validateBody(createPropertySchema),
  createProperty
);

router.get(
  '/',
  validateQuery(propertyQuerySchema),
  getProperties
);

router.get(
  '/:id',
  validateParams(propertyIdParamsSchema),
  getPropertyById
);

router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  validateParams(propertyIdParamsSchema),
  ...propertyUploadBundle,
  validateBody(updatePropertySchema),
  updateProperty
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateParams(propertyIdParamsSchema),
  deleteProperty
);

router.post(
  '/:id/images',
  authenticate,
  authorize('admin'),
  validateParams(propertyIdParamsSchema),
  ...propertyUploadBundle,
  requireImages,
  addImages
);

router.delete(
  '/:id/images/:imageIndex',
  authenticate,
  authorize('admin'),
  validateParams(propertyImageIndexSchema),
  deleteImage
);

export default router;
