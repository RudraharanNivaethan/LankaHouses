/**
 * Centralised API base URL — single source of truth for all service files.
 *
 * In development the frontend dev-server and the Express backend run on
 * different ports, so we point directly at the local backend.
 * In production the frontend is hosted on Vercel and must call the Railway
 * backend by its full public URL.
 *
 * Override either value via the corresponding VITE_* env variable so the
 * defaults can be changed without touching source code.
 *
 * DEV  default : http://localhost:8080/api
 * PROD default : https://backend-production-5de3.up.railway.app/api
 */

import { isDev } from '../utils/env';

const DEV_DEFAULT  = 'http://localhost:8080/api';
const PROD_DEFAULT = 'https://backend-production-5de3.up.railway.app/api';

export const API_BASE_URL: string = isDev()
  ? (import.meta.env.VITE_API_BASE_URL_DEV  ?? DEV_DEFAULT)
  : (import.meta.env.VITE_API_BASE_URL_PROD ?? PROD_DEFAULT);
