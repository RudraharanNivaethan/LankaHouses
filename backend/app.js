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

// Trust proxy — must be set before any middleware that reads req.ip.
// Value 1 = trust one upstream hop (Railway's load balancer), so req.ip
// reflects the real client address for rate limiting and logging.
if (isProduction()) app.set('trust proxy', 1);

// Security headers — X-Frame-Options, X-Content-Type-Options, HSTS, etc.
if (isProduction()) app.use(helmet());

// HTTP request logging
app.use(morgan(isProduction() ? 'combined' : 'dev'));

// CORS — active in both environments.
// FRONTEND_URL_PROD / FRONTEND_URL_DEV can be a comma-separated list of
// allowed origins so that multiple clients (e.g. Vercel preview URLs) can be
// added without code changes.
const rawFrontendUrl = process.env[`FRONTEND_URL_${getEnvSuffix()}`] ?? '';
const allowedOrigins = rawFrontendUrl
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, Postman).
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' is not allowed`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
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


// Prevent Vercel (and any other CDN/proxy) from caching API responses.
// Without this, GET /api/property/:id can be served from the edge cache after
// a PATCH update, making updates appear not to have been saved.
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
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
