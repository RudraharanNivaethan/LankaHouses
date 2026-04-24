/**
 * Debounce (ms) before applying `search` filters after typing pauses.
 * Override with `VITE_SEARCH_DEBOUNCE_MS` (clamped 150–3000).
 *
 * UX target: 600–800ms ("full thought" pattern — avoids triggering on mid-word pauses).
 * Default: 700ms.
 */
const raw = import.meta.env.VITE_SEARCH_DEBOUNCE_MS
const parsed = Number.parseInt(String(raw ?? ''), 10)
const DEFAULT_MS = 700

export const SEARCH_DEBOUNCE_MS =
  Number.isFinite(parsed) && parsed >= 150 && parsed <= 3000 ? parsed : DEFAULT_MS

