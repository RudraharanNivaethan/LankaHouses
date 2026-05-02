import { searchDebounceMs } from '../config/clientEnv';

/**
 * Debounce (ms) before applying `search` filters after typing pauses.
 * Value comes from `config/clientEnv.ts` (`VITE_SEARCH_DEBOUNCE_MS_DEV` / `_PROD` via `getEnvSuffix()`, clamped 150–3000).
 *
 * UX target: 600–800ms ("full thought" pattern — avoids triggering on mid-word pauses).
 * Default: 700ms.
 */
export const SEARCH_DEBOUNCE_MS = searchDebounceMs;

