import type { InquiryType, InquiryStatus } from '../../types/inquiry'
import { FilterChip } from '../ui/FilterChip'

export interface InquiryFilterValues {
  inquiryType?: InquiryType
  status?: InquiryStatus
  search?: string
}

interface InquiryFiltersProps {
  filters: InquiryFilterValues
  onChange: (filters: InquiryFilterValues) => void
  /** Render filters stacked vertically (for sidebar use). Defaults to false (horizontal). */
  vertical?: boolean
  /** Show a text search input (for admin inbox). Defaults to false. */
  showSearch?: boolean
}

const TYPE_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: 'GENERAL',  label: 'General' },
  { value: 'PROPERTY', label: 'Property' },
]

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'REPLIED', label: 'Replied' },
  { value: 'CLOSED',  label: 'Closed' },
]

const SELECT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand/30'

export function InquiryFilters({ filters, onChange, vertical = false, showSearch = false }: InquiryFiltersProps) {
  const activeChips: { key: keyof InquiryFilterValues; label: string }[] = []
  if (filters.inquiryType) {
    const opt = TYPE_OPTIONS.find((o) => o.value === filters.inquiryType)
    if (opt) activeChips.push({ key: 'inquiryType', label: `Type: ${opt.label}` })
  }
  if (filters.status) {
    const opt = STATUS_OPTIONS.find((o) => o.value === filters.status)
    if (opt) activeChips.push({ key: 'status', label: `Status: ${opt.label}` })
  }
  if (filters.search) {
    activeChips.push({ key: 'search', label: `Search: ${filters.search}` })
  }

  function removeFilter(key: keyof InquiryFilterValues) {
    onChange({ ...filters, [key]: undefined })
  }

  const controls = (
    <>
      {showSearch && (
        <div className={vertical ? 'flex flex-col gap-1' : ''}>
          {vertical && <p className="text-xs font-medium text-slate-500">Search</p>}
          <input
            type="text"
            aria-label="Search inquiries"
            placeholder="Search…"
            value={filters.search ?? ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
            className={SELECT_CLASS}
          />
        </div>
      )}

      <div className={vertical ? 'flex flex-col gap-1' : ''}>
        {vertical && <p className="text-xs font-medium text-slate-500">Status</p>}
        <select
          aria-label="Filter by status"
          value={filters.status ?? ''}
          onChange={(e) =>
            onChange({ ...filters, status: (e.target.value as InquiryStatus) || undefined })
          }
          className={SELECT_CLASS}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className={vertical ? 'flex flex-col gap-1' : ''}>
        {vertical && <p className="text-xs font-medium text-slate-500">Type</p>}
        <select
          aria-label="Filter by type"
          value={filters.inquiryType ?? ''}
          onChange={(e) =>
            onChange({ ...filters, inquiryType: (e.target.value as InquiryType) || undefined })
          }
          className={SELECT_CLASS}
        >
          <option value="">All types</option>
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </>
  )

  if (vertical) {
    return (
      <div className="flex flex-col gap-4">
        {controls}
        {activeChips.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-slate-500">Active filters</p>
            <div className="flex flex-wrap gap-1.5">
              {activeChips.map((chip) => (
                <FilterChip
                  key={chip.key}
                  label={chip.label}
                  onRemove={() => removeFilter(chip.key)}
                  removeAriaLabel={`Remove ${chip.label} filter`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {controls}
      {activeChips.map((chip) => (
        <FilterChip
          key={chip.key}
          label={chip.label}
          onRemove={() => removeFilter(chip.key)}
          removeAriaLabel={`Remove ${chip.label} filter`}
        />
      ))}
    </div>
  )
}
