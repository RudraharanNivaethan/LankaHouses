import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { Spinner } from './Spinner'

const defaultSearchIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
)

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Optional visible label; when omitted, use `aria-label` or `placeholder` for accessibility */
  label?: string
  error?: string
  hint?: string
  /** Extra classes on the outer field column wrapper */
  containerClassName?: string
  /** Replaces the default magnifying-glass icon */
  leadingIcon?: ReactNode
  /** Clears the field; when set, a clear control appears while there is text (controlled `value`) or while `clearVisible` is true */
  onClear?: () => void
  /** Use with uncontrolled inputs so the clear control can appear when you track value in parent state */
  clearVisible?: boolean
  clearAriaLabel?: string
  isLoading?: boolean
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      label,
      error,
      hint,
      id,
      className = '',
      containerClassName = '',
      leadingIcon,
      onClear,
      clearVisible = false,
      clearAriaLabel = 'Clear search',
      isLoading = false,
      disabled,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const autoId = useId()
    const inputId =
      id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : `search-${autoId.replace(/:/g, '')}`)

    const isControlled = value !== undefined
    const hasText =
      isControlled && value !== null && String(value).length > 0
    const showClear = Boolean(onClear && !disabled && (hasText || (!isControlled && clearVisible)))

    const trailingSlots = (isLoading ? 1 : 0) + (showClear ? 1 : 0)
    const rightPad =
      trailingSlots === 2 ? 'pr-[4.5rem]' : trailingSlots === 1 ? 'pr-10' : ''

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`.trim()}>
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        ) : null}

        <div className="relative">
          <span
            className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-slate-400"
            aria-hidden
          >
            {leadingIcon ?? defaultSearchIcon}
          </span>

          <input
            ref={ref}
            id={inputId}
            type="search"
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={!!error}
            aria-busy={isLoading || undefined}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={[
              'w-full rounded-lg border py-2.5 pl-10 text-sm text-slate-900 outline-none transition-all',
              rightPad,
              'placeholder:text-slate-400',
              'focus:ring-2 focus:ring-brand/30 focus:border-brand',
              error
                ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-500'
                : 'border-slate-300 bg-white hover:border-slate-400',
              className,
            ].join(' ')}
            {...props}
          />

          {isLoading ? (
            <span
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-brand ${
                showClear ? 'right-10' : 'right-3'
              }`}
              aria-hidden
            >
              <Spinner className="h-4 w-4" />
            </span>
          ) : null}

          {showClear ? (
            <button
              type="button"
              onClick={onClear}
              disabled={disabled}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:pointer-events-none disabled:opacity-50"
              aria-label={clearAriaLabel}
              tabIndex={-1}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>

        {hint && !error ? (
          <p id={`${inputId}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        ) : null}

        {error ? (
          <p id={`${inputId}-error`} role="alert" className="flex items-center gap-1 text-xs text-red-600">
            <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

SearchBar.displayName = 'SearchBar'
