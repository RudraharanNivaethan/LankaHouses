/**
 * Debounce (ms) before applying listing `search` to the API after typing pauses.
 * Override with `VITE_PROPERTY_SEARCH_DEBOUNCE_MS` (clamped 150–3000).
 */
const raw = import.meta.env.VITE_PROPERTY_SEARCH_DEBOUNCE_MS
const parsed = Number.parseInt(String(raw ?? ''), 10)
const DEFAULT_MS = 550

export const PROPERTY_SEARCH_DEBOUNCE_MS =
  Number.isFinite(parsed) && parsed >= 150 && parsed <= 3000 ? parsed : DEFAULT_MS
