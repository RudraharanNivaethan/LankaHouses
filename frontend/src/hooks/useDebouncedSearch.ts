import { useMemo } from 'react'
import { SEARCH_DEBOUNCE_MS } from '../constants/search'
import { useDebouncedValue } from './useDebouncedValue'

export interface DebouncedSearchOptions {
  /** Override the global debounce delay (avoid per-page hardcoding). */
  delayMs?: number
  /** Clamp search length; default 150. */
  maxLength?: number
  /** Trim whitespace; default true. */
  trim?: boolean
}

export interface DebouncedSearchResult {
  /** Normalized version of the current input (trim/clamp applied). */
  normalized: string
  /** Debounced, normalized value. */
  debounced: string
}

export function normalizeSearchInput(
  input: string,
  { trim = true, maxLength = 150 }: Pick<DebouncedSearchOptions, 'trim' | 'maxLength'> = {},
): string {
  const base = trim ? input.trim() : input
  if (!base) return ''
  return base.length > maxLength ? base.slice(0, maxLength) : base
}

/**
 * Central debounced-search hook to ensure consistent, natural search UX.
 * Debounce timing comes from `SEARCH_DEBOUNCE_MS` by default (env-configurable).
 *
 * Note: the underlying timer logic lives in `useDebouncedValue` to avoid duplication.
 */
export function useDebouncedSearch(input: string, options: DebouncedSearchOptions = {}): DebouncedSearchResult {
  const normalized = useMemo(
    () => normalizeSearchInput(input, options),
    [input, options.maxLength, options.trim],
  )

  const debounced = useDebouncedValue(normalized, options.delayMs ?? SEARCH_DEBOUNCE_MS)

  return { normalized, debounced }
}

