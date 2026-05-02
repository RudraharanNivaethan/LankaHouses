/**
 * Environment detection — single source of truth for the frontend.
 * All other files must import from here; never inline import.meta.env.MODE checks.
 *
 * VITE_APP_ENV ('production' | 'development') takes explicit precedence over Vite's
 * MODE so that `vite dev` can target the production Firebase project when the backend
 * runs with NODE_ENV=production. Any unrecognised or missing value falls back to MODE,
 * which itself defaults to production (fail-safe).
 *
 * Backend `getEnvSuffix()` uses NODE_ENV === 'production'; set VITE_APP_ENV to the
 * same value to ensure both sides target the same Firebase project.
 */
const appEnv = import.meta.env.VITE_APP_ENV;
const mode   = import.meta.env.MODE;

// VITE_APP_ENV (explicit) takes precedence; falls back to Vite MODE.
const resolvedEnv =
  appEnv === 'production' || appEnv === 'development' ? appEnv : mode;

export const isProd = (): boolean => resolvedEnv !== 'development';
export const isDev  = (): boolean => resolvedEnv === 'development';

/** Mirrors backend `getEnvSuffix()` for shared DEV/PROD labeling in client code. */
export const getEnvSuffix = (): 'DEV' | 'PROD' => (isDev() ? 'DEV' : 'PROD');
