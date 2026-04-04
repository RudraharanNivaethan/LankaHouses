import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'mongo-sanitize';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy (required for correct IP behind load balancers/Render/Heroku/etc)
// app.set('trust proxy', true); Uncomment this in production

// Security headers (Helmet 8.1.0 - no known vulnerabilities)
// Sets: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, etc.
// app.use(helmet()); Uncomment this in production

// CORS — active in both environments
// Dev: allows FRONTEND_URL from .env with fallback to localhost:5173
// Prod: requires FRONTEND_URL to be explicitly set, no fallback
const corsOptions = {
  origin: isProduction
    ? process.env.FRONTEND_URL
    : process.env.FRONTEND_URL || 'http://localhost:5173',
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
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body'
    });
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


// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Resource not found'
  });
});

export default app;