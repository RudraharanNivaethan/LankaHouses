import { z } from 'zod';

const SEARCH_MAX_LENGTH = 150;

/** Internal sentinel: preprocess maps invalid shapes to this so Zod fails with a clear message */
const INVALID_SEARCH = '__INVALID_SEARCH_PARAMETER__';

/**
 * Escape a user substring for safe use as a RegExp literal (reduces ReDoS / metachar breakage).
 * Used by property listing search only; keep in sync with any other code that builds RegExp from `search`.
 */
export function escapeRegexLiteral(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalize `req.query.search` (Express + qs): string, first string in array, or invalid object shapes.
 * @returns {string|undefined|typeof INVALID_SEARCH}
 */
function normalizeSearchQueryValue(val) {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'string') {
    const t = val.trim();
    return t === '' ? undefined : t;
  }
  if (Array.isArray(val)) {
    const first = val.find((x) => typeof x === 'string');
    if (first === undefined) return INVALID_SEARCH;
    const t = first.trim();
    return t === '' ? undefined : t;
  }
  if (typeof val === 'object') return INVALID_SEARCH;
  if (typeof val === 'number' || typeof val === 'boolean') {
    const t = String(val).trim();
    return t === '' ? undefined : t;
  }
  return INVALID_SEARCH;
}

/**
 * Optional listing `search` query: rejects nested objects/arrays from qs injection; max length; no NUL.
 * Output is a plain trimmed string for Mongo substring / token logic (not regex-escaped here).
 */
export const searchQueryField = z.preprocess(
  (val) => normalizeSearchQueryValue(val),
  z.union([
    z.undefined(),
    z.literal(INVALID_SEARCH).refine(() => false, { message: 'Invalid search parameter' }),
    z
      .string()
      .max(SEARCH_MAX_LENGTH, `Search is at most ${SEARCH_MAX_LENGTH} characters`)
      .refine((s) => !s.includes('\0'), { message: 'Invalid search parameter' })
      .refine((s) => s !== INVALID_SEARCH, { message: 'Invalid search parameter' }),
  ]),
);
