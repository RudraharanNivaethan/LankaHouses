import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateBody, validateParams, validateQuery } from '../validation/validationMiddleware.js';
import {
  createPropertySchema,
  updatePropertySchema,
  propertyQuerySchema,
  propertyIdParamsSchema,
} from '../validation/schemas/propertySchema.js';
import { propertyUploadBundle } from '../middleware/uploadMiddleware.js';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('admin'),
  ...propertyUploadBundle,
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

export default router;
