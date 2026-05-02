/**
 * Generic Validation Middleware
 *
 * Provides factory functions for validating request body, params, and query
 * using Zod schemas. Returns consistent error responses via the central handler.
 */

import { ValidationError, formatErrorResponse } from '../utils/errorUtils.js';

/**
 * Validates request body against a Zod schema
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues ?? [];
    const errors = issues.map((err) => err.message);
    const validationErr = new ValidationError(errors);
    const { statusCode, response } = formatErrorResponse(validationErr);
    return res.status(statusCode).json(response);
  }

  // Replace body with sanitized/transformed data
  req.body = result.data;
  next();
};

/**
 * Validates request params against a Zod schema
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    const issues = result.error.issues ?? [];
    const errors = issues.map((err) => err.message);
    const validationErr = new ValidationError(errors);
    const { statusCode, response } = formatErrorResponse(validationErr);
    return res.status(statusCode).json(response);
  }

  req.validatedParams = result.data;
  next();
};

/**
 * Validates request query against a Zod schema
 * Attaches sanitized query to req.validatedQuery
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    const issues = result.error.issues ?? [];
    const errors = issues.map((err) => err.message);
    const validationErr = new ValidationError(errors);
    const { statusCode, response } = formatErrorResponse(validationErr);
    return res.status(statusCode).json(response);
  }

  // Attach sanitized query for use in controller
  req.validatedQuery = result.data;
  next();
};
