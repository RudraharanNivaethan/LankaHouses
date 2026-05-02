/**
 * Environment detection — single source of truth for the backend.
 * All other files must import from here; never inline NODE_ENV checks.
 * Unrecognised or missing NODE_ENV defaults to production (fail-safe).
 */
export const isProduction = () => process.env.NODE_ENV === 'production';

// Returns the suffix used for all environment-specific variable names.
export const getEnvSuffix = () => isProduction() ? 'PROD' : 'DEV';
