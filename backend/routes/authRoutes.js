import { Router } from 'express';
import { validateBody } from '../validation/validationMiddleware.js';
// [OLD CODE] import { loginSchema, registerSchema, firebaseRegisterSchema } from '../validation/schemas/authSchema.js';
import { firebaseRegisterSchema } from '../validation/schemas/authSchema.js';
// [OLD CODE] import { register, login, logout, refreshToken, getMe, firebaseExchange, firebaseRegister } from '../controllers/authController.js';
import { logout, refreshToken, getMe, firebaseExchange, firebaseRegister } from '../controllers/authController.js';
// [OLD CODE] import { loginLimiter, registerLimiter, refreshTokenLimiter, firebaseExchangeLimiter, firebaseRegisterLimiter } from '../middleware/rateLimitMiddleware.js';
import { refreshTokenLimiter, firebaseExchangeLimiter, firebaseRegisterLimiter } from '../middleware/rateLimitMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// [OLD CODE] Classic credential routes — superseded by Firebase authentication.
// router.post('/register', registerLimiter,  validateBody(registerSchema), register);
// router.post('/login',    loginLimiter,      validateBody(loginSchema),    login);

router.post('/logout',            logout);
router.post('/refresh',           refreshTokenLimiter,     refreshToken);
router.post('/firebase-register', firebaseRegisterLimiter, validateBody(firebaseRegisterSchema), firebaseRegister);
router.post('/firebase-exchange', firebaseExchangeLimiter, firebaseExchange);
router.get('/me',                 authenticate,            getMe);

export default router;
