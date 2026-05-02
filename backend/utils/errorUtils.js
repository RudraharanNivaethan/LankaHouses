/**
 * Production-Safe Error Handling Utilities
 *
 * Prevents leakage of sensitive information in error responses:
 * - Stack traces
 * - File paths
 * - MongoDB query details
 * - Internal schema information
 */

import { isProduction } from './env.js';

/**
 * Custom application error for user-facing messages.
 * These errors are safe to show to users in any environment.
 *
 * Optional fields set after construction:
 *   error.code    — machine-readable semantic code (e.g. 'VALIDATION_ERROR')
 *   error.details — dev-only diagnostic context (stripped in production)
 */
export class AppError extends Error {
  constructor(message, statusCode = 400, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    this.code = null;
    this.details = null;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * HTTP Status codes for common error types
 */
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * Generic safe messages for production
 */
const SAFE_MESSAGES = {
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  CAST_ERROR: 'Invalid ID format.',
  DUPLICATE_ERROR: 'Resource already exists.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Authentication required.',
  FORBIDDEN: 'Access denied.',
  TOKEN_EXPIRED: 'Session expired. Please login again.',
  TOKEN_INVALID: 'Invalid token. Please login again.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
  DATABASE_ERROR: 'A database error occurred. Please try again later.',
  RATE_LIMIT: 'Too many requests. Please try again later.'
};

// ─── Error sub-classes ────────────────────────────────────────────────────────

export class ValidationError extends AppError {
  constructor(zodIssues = []) {
    super(SAFE_MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST);
    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
    this.details = zodIssues; // stripped in production by formatErrorResponse
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(SAFE_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    this.name = 'NotFoundError';
    this.code = 'NOT_FOUND';
    this.details = resource;
  }
}

// ─── Predicates ───────────────────────────────────────────────────────────────

/**
 * Determines if an error is operational (expected) or a programming error.
 * Operational errors are safe to show to users.
 */
export const isOperationalError = (error) => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  if (error.name === 'ValidationError') return true;
  if (error.name === 'CastError')       return true;
  if (error.code === 11000)             return true;
  if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') return true;
  return false;
};

/**
 * Gets the appropriate HTTP status code for an error.
 */
export const getErrorStatusCode = (error) => {
  if (error instanceof AppError)             return error.statusCode;
  if (error.name === 'ValidationError')      return HTTP_STATUS.BAD_REQUEST;
  if (error.name === 'CastError')            return HTTP_STATUS.BAD_REQUEST;
  if (error.code === 11000)                  return HTTP_STATUS.CONFLICT;
  if (error.name === 'TokenExpiredError')    return HTTP_STATUS.UNAUTHORIZED;
  if (error.name === 'JsonWebTokenError')    return HTTP_STATUS.UNAUTHORIZED;
  return HTTP_STATUS.INTERNAL_ERROR;
};

/**
 * Returns a safe error message based on error type and environment.
 * In production: returns generic messages to hide sensitive details.
 * In development: returns detailed messages for debugging.
 */
export const getSafeErrorMessage = (error) => {
  const isProd = isProduction();

  if (error instanceof AppError) {
    return error.message;
  }

  if (error.name === 'ValidationError') {
    if (isProd) return SAFE_MESSAGES.VALIDATION_ERROR;
    const messages = Object.values(error.errors || {}).map(e => e.message);
    return messages.length > 0 ? messages.join(', ') : error.message;
  }

  if (error.name === 'CastError') {
    if (isProd) return SAFE_MESSAGES.CAST_ERROR;
    return `Invalid ${error.path}: ${error.value}`;
  }

  if (error.code === 11000) {
    if (isProd) return SAFE_MESSAGES.DUPLICATE_ERROR;
    const field = Object.keys(error.keyValue || {})[0];
    return field ? `Duplicate value for field: ${field}` : 'Duplicate key error';
  }

  if (error.name === 'TokenExpiredError') {
    return SAFE_MESSAGES.TOKEN_EXPIRED;
  }

  if (error.name === 'JsonWebTokenError') {
    if (isProd) return SAFE_MESSAGES.TOKEN_INVALID;
    return `Token error: ${error.message}`;
  }

  if (isProd) return SAFE_MESSAGES.INTERNAL_ERROR;
  return error.message || SAFE_MESSAGES.INTERNAL_ERROR;
};

/**
 * Formats error response object based on environment.
 * Includes stack trace and details only in development.
 * Semantic `code` strings (e.g. 'VALIDATION_ERROR') are safe in all envs.
 */
export const formatErrorResponse = (error) => {
  const isProd = isProduction();
  const statusCode = getErrorStatusCode(error);
  const message = getSafeErrorMessage(error);

  const response = {
    success: false,
    error: message
  };

  // Semantic code strings are machine-readable and safe to expose in production
  if (error.code != null && typeof error.code === 'string') {
    response.code = error.code;
  }

  if (!isProd) {
    response.errorType = error.name || 'Error';
    if (error.stack)   response.stack   = error.stack;
    if (error.details) response.details = error.details;
  }

  return { statusCode, response };
};

/**
 * Checks if an error message is safe to expose to clients.
 */
export const isSafeMessage = (message, safeMessages = []) => {
  return safeMessages.some(safeMsg =>
    message === safeMsg || message.startsWith(safeMsg.split(':')[0])
  );
};

// ─── Logging ──────────────────────────────────────────────────────────────────

/**
 * Sanitizes error for logging — removes sensitive data but keeps useful info.
 * Not exported as standalone; use logError() instead.
 */
const sanitizeErrorForLogging = (error, req = null) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    name: error.name,
    message: error.message,
    statusCode: getErrorStatusCode(error),
    isOperational: isOperationalError(error)
  };

  if (req) {
    logEntry.method  = req.method;
    logEntry.path    = req.path;
    logEntry.ip      = req.ip;
    logEntry.userAgent = req.get('user-agent');
  }

  // Include stack trace for non-operational (programming) errors
  if (!logEntry.isOperational && error.stack) {
    logEntry.stack = error.stack;
  }

  return logEntry;
};

/**
 * Central logging function — the only place that writes to console.error
 * or the observability SDK.
 *
 * @param {unknown} error
 * @param {{ req?: import('express').Request, [key: string]: unknown }} [context]
 */
export const logError = (error, context = {}) => {
  const { req, ...extra } = context;
  const logEntry = sanitizeErrorForLogging(error, req ?? null);
  Object.assign(logEntry, extra);

  if (isProduction()) {
    // TODO: replace with observability SDK once installed, e.g.:
    // Sentry.captureException(error, { extra: logEntry });
    // Until then, write to stderr so nothing is silently swallowed.
    process.stderr.write(JSON.stringify(logEntry) + '\n');
  } else {
    console.error('[ERROR]', logEntry);
  }
};

// ─── Global Express error middleware ─────────────────────────────────────────

/**
 * Register once as the final app.use() in app.js.
 * Delegates entirely to existing formatErrorResponse + logError — no new logic.
 */
export const globalErrorMiddleware = (err, req, res, next) => {
  logError(err, { req });
  const { statusCode, response } = formatErrorResponse(err);
  res.status(statusCode).json(response);
};

export default {
  AppError,
  ValidationError,
  NotFoundError,
  HTTP_STATUS,
  isOperationalError,
  getErrorStatusCode,
  getSafeErrorMessage,
  formatErrorResponse,
  isSafeMessage,
  logError,
  globalErrorMiddleware
};
