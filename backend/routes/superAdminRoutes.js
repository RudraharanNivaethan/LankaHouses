import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { PERMISSION } from '../utils/permissionKeys.js';
import { validateBody, validateQuery } from '../validation/validationMiddleware.js';
import {
  listUsersQuerySchema,
  userSuggestQuerySchema,
  createAdminSchema,
} from '../validation/schemas/superAdminSchema.js';
import {
  superAdminListLimiter,
  superAdminStatsLimiter,
  superAdminCreateLimiter,
  superAdminSuggestLimiter,
} from '../middleware/rateLimitMiddleware.js';
import {
  getUsers,
  getUserStats,
  createAdmin,
  suggestUsers,
} from '../controllers/superAdminController.js';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize(PERMISSION.USERS_READ),
  superAdminListLimiter,
  validateQuery(listUsersQuerySchema),
  getUsers,
);

router.get(
  '/stats',
  authenticate,
  authorize(PERMISSION.USERS_STATS_READ),
  superAdminStatsLimiter,
  getUserStats,
);

router.get(
  '/suggest',
  authenticate,
  authorize(PERMISSION.USERS_READ),
  superAdminSuggestLimiter,
  validateQuery(userSuggestQuerySchema),
  suggestUsers,
);

router.post(
  '/admins',
  authenticate,
  authorize(PERMISSION.ADMINS_CREATE),
  superAdminCreateLimiter,
  validateBody(createAdminSchema),
  createAdmin,
);

export default router;
