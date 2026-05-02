/**
 * Environment detection — single source of truth for the frontend.
 * All other files must import from here; never inline import.meta.env.MODE checks.
 * Any unrecognised or missing MODE value is treated as production (fail-safe default).
 */
const mode = import.meta.env.MODE;

export const isProd = (): boolean => mode !== 'development';
export const isDev = (): boolean => mode === 'development';
