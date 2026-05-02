/**
 * Single place for `import.meta.env.VITE_*` reads (see also `utils/env.ts` for MODE).
 * Uses `_DEV` / `_PROD` suffixes like the backend; values are chosen via static
 * `import.meta.env` references so Vite can inline and tree-shake correctly.
 */

import { getEnvSuffix, isDev } from '../utils/env';

const s = getEnvSuffix();

function pick<T extends string | undefined>(dev: T, prod: T): T {
  return s === 'DEV' ? dev : prod;
}

const rawDebounce = pick(
  import.meta.env.VITE_SEARCH_DEBOUNCE_MS_DEV,
  import.meta.env.VITE_SEARCH_DEBOUNCE_MS_PROD,
);
const parsedDebounce = Number.parseInt(String(rawDebounce ?? ''), 10);
const DEFAULT_SEARCH_DEBOUNCE_MS = 700;

/** Debounce (ms) for property search; clamped 150–3000, default 700. */
export const searchDebounceMs =
  Number.isFinite(parsedDebounce) && parsedDebounce >= 150 && parsedDebounce <= 3000
    ? parsedDebounce
    : DEFAULT_SEARCH_DEBOUNCE_MS;

export const firebaseWebConfig = {
  apiKey: pick(
    import.meta.env.VITE_FIREBASE_API_KEY_DEV,
    import.meta.env.VITE_FIREBASE_API_KEY_PROD,
  ),
  authDomain: pick(
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_DEV,
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_PROD,
  ),
  projectId: pick(
    import.meta.env.VITE_FIREBASE_PROJECT_ID_DEV,
    import.meta.env.VITE_FIREBASE_PROJECT_ID_PROD,
  ),
  storageBucket: pick(
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_DEV,
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_PROD,
  ),
  messagingSenderId: pick(
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_DEV,
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_PROD,
  ),
  appId: pick(
    import.meta.env.VITE_FIREBASE_APP_ID_DEV,
    import.meta.env.VITE_FIREBASE_APP_ID_PROD,
  ),
} as const;

if (isDev()) {
  const missing: string[] = [];
  if (!firebaseWebConfig.apiKey) missing.push(`VITE_FIREBASE_API_KEY_${s}`);
  if (!firebaseWebConfig.authDomain) missing.push(`VITE_FIREBASE_AUTH_DOMAIN_${s}`);
  if (!firebaseWebConfig.projectId) missing.push(`VITE_FIREBASE_PROJECT_ID_${s}`);
  if (!firebaseWebConfig.storageBucket) missing.push(`VITE_FIREBASE_STORAGE_BUCKET_${s}`);
  if (!firebaseWebConfig.messagingSenderId) missing.push(`VITE_FIREBASE_MESSAGING_SENDER_ID_${s}`);
  if (!firebaseWebConfig.appId) missing.push(`VITE_FIREBASE_APP_ID_${s}`);
  if (missing.length) {
    throw new Error(`Missing Firebase client env for ${s}: ${missing.join(', ')}. Check your .env file.`);
  }
}
