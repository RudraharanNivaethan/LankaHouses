import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import adminInquiryRoutes from './routes/adminInquiryRoutes.js';
import { globalLimiter } from './middleware/rateLimitMiddleware.js';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'mongo-sanitize';
import { isProduction, getEnvSuffix } from './utils/env.js';
import {
  AppError,
  NotFoundError,
  formatErrorResponse,
  globalErrorMiddleware
} from './utils/errorUtils.js';

const app = express();

// Trust proxy (required for correct IP behind load balancers/Render/Heroku/etc)
// app.set('trust proxy', true); Uncomment this in production

// Security headers (Helmet 8.1.0 - no known vulnerabilities)
// app.use(helmet()); Uncomment this in production

// HTTP request logging
app.use(morgan(isProduction() ? 'combined' : 'dev'));

// CORS — active in both environments
const FRONTEND_URL = process.env[`FRONTEND_URL_${getEnvSuffix()}`];
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Handle JSON parsing errors (malformed request body)
// Must be after express.json() to catch SyntaxError from body-parser
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const { statusCode, response } = formatErrorResponse(
      new AppError('Invalid JSON in request body', 400)
    );
    return res.status(statusCode).json(response);
  }
  next(err);
});

// Sanitize data to prevent NoSQL injection (Express 5 compatible)
// Note: In Express 5, req.query and req.params are read-only getters
// We only sanitize req.body here. Query/params are validated in controllers.
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = mongoSanitize(req.body);
  }
  next();
});


// Routes
app.use('/api', globalLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin/inquiries', adminInquiryRoutes);


// 404 handler — routes through globalErrorMiddleware for uniform shaping
app.use((req, res, next) => next(new NotFoundError()));

// Global error middleware — must be the last app.use
app.use(globalErrorMiddleware);

export default app;
