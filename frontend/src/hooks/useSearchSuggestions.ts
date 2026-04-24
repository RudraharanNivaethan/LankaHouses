import { useEffect, useState } from 'react'
import { useDebouncedSearch } from './useDebouncedSearch'

export interface UseSearchSuggestionsOptions {
  /** Current raw input value from the search field. */
  query: string
  /** Async function that calls the backend suggest endpoint. */
  fetcher: (q: string) => Promise<string[]>
  /** Minimum normalized length before fetching; default 1. */
  minLength?: number
}

export interface UseSearchSuggestionsResult {
  suggestions: string[]
  isLoadingSuggestions: boolean
  clearSuggestions: () => void
}

/**
 * Generic hook that fetches autocomplete suggestions for any search input.
 * Uses useDebouncedSearch internally — no new debounce timer logic here.
 * `fetcher` is called only when the debounced normalized query meets `minLength`.
 */
export function useSearchSuggestions({
  query,
  fetcher,
  minLength = 1,
}: UseSearchSuggestionsOptions): UseSearchSuggestionsResult {
  const { debounced } = useDebouncedSearch(query)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  useEffect(() => {
    if (!debounced || debounced.length < minLength) {
      setSuggestions([])
      return
    }

    let cancelled = false
    setIsLoadingSuggestions(true)

    fetcher(debounced)
      .then((results) => {
        if (!cancelled) setSuggestions(results)
      })
      .catch(() => {
        if (!cancelled) setSuggestions([])
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSuggestions(false)
      })

    return () => {
      cancelled = true
    }
  }, [debounced, fetcher, minLength])

  const clearSuggestions = () => setSuggestions([])

  return { suggestions, isLoadingSuggestions, clearSuggestions }
}
