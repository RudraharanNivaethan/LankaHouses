/**
 * Single place for `import.meta.env.VITE_*` reads (see also `utils/env.ts` for MODE).
 * Add new public env vars here only.
 */

const rawDebounce = import.meta.env.VITE_SEARCH_DEBOUNCE_MS;
const parsedDebounce = Number.parseInt(String(rawDebounce ?? ''), 10);
const DEFAULT_SEARCH_DEBOUNCE_MS = 700;

/** Debounce (ms) for property search; clamped 150–3000, default 700. */
export const searchDebounceMs =
  Number.isFinite(parsedDebounce) && parsedDebounce >= 150 && parsedDebounce <= 3000
    ? parsedDebounce
    : DEFAULT_SEARCH_DEBOUNCE_MS;

export const firebaseWebConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} as const;
