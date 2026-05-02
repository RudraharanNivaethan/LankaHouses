/**
 * Centralised API base URL — single source of truth for all service files.
 *
 * In development the frontend dev-server and the Express backend run on
 * different ports, so we point directly at the local backend.
 * In production all /api/* requests are proxied through Vercel's edge to the
 * Railway backend (configured via the rewrite rule in vercel.json), so a
 * relative path is used — no hard-coded Railway URL in frontend code.
 *
 * Override either value via the corresponding VITE_* env variable so the
 * defaults can be changed without touching source code.
 *
 * DEV  default : http://localhost:3000/api  (direct to local backend)
 * PROD default : /api                       (proxied through Vercel to Railway)
 */

import { isDev } from '../utils/env';

const DEV_DEFAULT  = 'http://localhost:3000/api';
const PROD_DEFAULT = '/api';

export const API_BASE_URL: string = isDev()
  ? (import.meta.env.VITE_API_BASE_URL_DEV  ?? DEV_DEFAULT)
  : (import.meta.env.VITE_API_BASE_URL_PROD ?? PROD_DEFAULT);
