import { Router } from 'express';
import { validateBody } from '../validation/validationMiddleware.js';
import { loginSchema, registerSchema } from '../validation/schemas/authSchema.js';
import { register, login, logout, refreshToken } from '../controllers/authController.js';
import { loginLimiter, registerLimiter, refreshTokenLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.post('/register', registerLimiter,    validateBody(registerSchema), register);
router.post('/login',    loginLimiter,        validateBody(loginSchema),    login);
router.post('/logout',   logout);
router.post('/refresh',  refreshTokenLimiter, refreshToken);

export default router;
