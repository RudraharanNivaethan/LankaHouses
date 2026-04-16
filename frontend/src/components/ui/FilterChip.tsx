interface FilterChipProps {
  label: string
  onRemove: () => void
  removeAriaLabel: string
}

export function FilterChip({ label, onRemove, removeAriaLabel }: FilterChipProps) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-slate-200 bg-surface py-1 pl-2.5 pr-1 text-xs font-medium text-slate-700 shadow-sm">
      <span className="min-w-0 truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeAriaLabel}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}
