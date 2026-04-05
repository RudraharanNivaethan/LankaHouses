import { Router } from 'express';
import { validateBody } from '../validation/validationMiddleware.js';
import { updateProfileSchema } from '../validation/schemas/userSchema.js';
import { updateProfile } from '../controllers/userController.js';
import { profileUpdateLimiter } from '../middleware/rateLimitMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.patch('/profile', authenticate, profileUpdateLimiter, validateBody(updateProfileSchema), updateProfile);

export default router;
