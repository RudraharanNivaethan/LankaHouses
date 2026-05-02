/**
 * Environment detection — single source of truth for the frontend.
 * All other files must import from here; never inline import.meta.env.MODE checks.
 * Any unrecognised or missing MODE value is treated as production (fail-safe default).
 *
 * Backend `getEnvSuffix()` uses NODE_ENV === 'production'; here prod means MODE !== 'development'
 * (Vite). The two are parallel naming, not identical runtime detection.
 */
const mode = import.meta.env.MODE;

export const isProd = (): boolean => mode !== 'development';
export const isDev = (): boolean => mode === 'development';

/** Mirrors backend `getEnvSuffix()` for shared DEV/PROD labeling in client code. */
export const getEnvSuffix = (): 'DEV' | 'PROD' => (isDev() ? 'DEV' : 'PROD');
