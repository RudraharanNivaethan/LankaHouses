import { useEffect, useId, useRef, useState } from 'react'
import { SearchBar } from './SearchBar'
import { Spinner } from './Spinner'

export interface SearchAutocompleteProps {
  /** Controlled input value. */
  value: string
  /** Called on every keystroke — drives autocomplete fetch, NOT results. */
  onChange: (value: string) => void
  /**
   * Called when the user confirms a search:
   * Enter key, search button click, or clicking a suggestion.
   */
  onSubmit: (value: string) => void
  /** Called when the user clears the input. */
  onClear: () => void
  /** Suggestion strings returned by useSearchSuggestions. */
  suggestions: string[]
  /** True while the suggest API call is in flight. */
  isLoadingSuggestions?: boolean
  /** True while the full results are loading (forwarded to SearchBar). */
  isLoading?: boolean
  placeholder?: string
  'aria-label'?: string
  maxLength?: number
}

export function SearchAutocomplete({
  value,
  onChange,
  onSubmit,
  onClear,
  suggestions,
  isLoadingSuggestions = false,
  isLoading = false,
  placeholder,
  'aria-label': ariaLabel,
  maxLength,
}: SearchAutocompleteProps) {
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)

  const showDropdown = isOpen && (suggestions.length > 0 || isLoadingSuggestions)

  useEffect(() => {
    setActiveIndex(-1)
    setIsOpen(suggestions.length > 0 || isLoadingSuggestions)
  }, [suggestions, isLoadingSuggestions])

  useEffect(() => {
    if (!value) {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (e.key === 'Enter' && value.trim()) {
        e.preventDefault()
        handleSubmit(value.trim())
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, -1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelectSuggestion(suggestions[activeIndex])
        } else if (value.trim()) {
          handleSubmit(value.trim())
        }
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        break
    }
  }

  const handleSubmit = (term: string) => {
    setIsOpen(false)
    setActiveIndex(-1)
    onSubmit(term)
  }

  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion)
    handleSubmit(suggestion)
  }

  const handleClear = () => {
    setIsOpen(false)
    setActiveIndex(-1)
    onClear()
  }

  const handleSearchBarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e)
  }

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <SearchBar
        value={value}
        onChange={handleChange}
        onClear={handleClear}
        onKeyDown={handleSearchBarKeyDown}
        onFocus={() => {
          if (suggestions.length > 0 || isLoadingSuggestions) setIsOpen(true)
        }}
        isLoading={isLoading}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-controls={showDropdown ? listId : undefined}
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
        }
        maxLength={maxLength}
      />

      {showDropdown && (
        <div
          id={listId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {isLoadingSuggestions && suggestions.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-slate-500">
              <Spinner className="h-4 w-4 text-brand" />
              <span>Finding suggestions…</span>
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto py-1">
              {suggestions.map((s, i) => (
                <li
                  key={s}
                  id={`${listId}-option-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSelectSuggestion(s)
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={[
                    'flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors',
                    i === activeIndex
                      ? 'bg-brand/10 text-brand'
                      : 'text-slate-700 hover:bg-slate-50',
                  ].join(' ')}
                >
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <span className="truncate">{s}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
