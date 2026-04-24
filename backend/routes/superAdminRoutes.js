import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateBody, validateQuery } from '../validation/validationMiddleware.js';
import {
  listUsersQuerySchema,
  createAdminSchema,
} from '../validation/schemas/superAdminSchema.js';
import {
  superAdminListLimiter,
  superAdminStatsLimiter,
  superAdminCreateLimiter,
} from '../middleware/rateLimitMiddleware.js';
import {
  getUsers,
  getUserStats,
  createAdmin,
} from '../controllers/superAdminController.js';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('superadmin'),
  superAdminListLimiter,
  validateQuery(listUsersQuerySchema),
  getUsers,
);

router.get(
  '/stats',
  authenticate,
  authorize('superadmin'),
  superAdminStatsLimiter,
  getUserStats,
);

router.post(
  '/admins',
  authenticate,
  authorize('superadmin'),
  superAdminCreateLimiter,
  validateBody(createAdminSchema),
  createAdmin,
);

export default router;
