import type { InquiryType, InquiryStatus } from '../../types/inquiry'
import { FilterChip } from '../ui/FilterChip'

export interface InquiryFilterValues {
  inquiryType?: InquiryType
  status?: InquiryStatus
}

interface InquiryFiltersProps {
  filters: InquiryFilterValues
  onChange: (filters: InquiryFilterValues) => void
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

export function InquiryFilters({ filters, onChange }: InquiryFiltersProps) {
  const activeChips: { key: keyof InquiryFilterValues; label: string }[] = []
  if (filters.inquiryType) {
    const opt = TYPE_OPTIONS.find((o) => o.value === filters.inquiryType)
    if (opt) activeChips.push({ key: 'inquiryType', label: `Type: ${opt.label}` })
  }
  if (filters.status) {
    const opt = STATUS_OPTIONS.find((o) => o.value === filters.status)
    if (opt) activeChips.push({ key: 'status', label: `Status: ${opt.label}` })
  }

  function removeFilter(key: keyof InquiryFilterValues) {
    onChange({ ...filters, [key]: undefined })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        aria-label="Filter by type"
        value={filters.inquiryType ?? ''}
        onChange={(e) =>
          onChange({ ...filters, inquiryType: (e.target.value as InquiryType) || undefined })
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand/30"
      >
        <option value="">All types</option>
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        aria-label="Filter by status"
        value={filters.status ?? ''}
        onChange={(e) =>
          onChange({ ...filters, status: (e.target.value as InquiryStatus) || undefined })
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand/30"
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

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
