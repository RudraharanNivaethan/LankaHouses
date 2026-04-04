import { Router } from 'express';
import { validateBody } from '../validation/validationMiddleware.js';
import { loginSchema, registerSchema } from '../validation/schemas/authSchema.js';
import { register, login, logout, refreshToken } from '../controllers/authController.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login',    validateBody(loginSchema),    login);
router.post('/logout',   logout);
router.post('/refresh',  refreshToken);

export default router;
