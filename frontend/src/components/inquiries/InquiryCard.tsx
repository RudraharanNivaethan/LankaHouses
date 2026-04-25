import type { InquiryRecord } from '../../types/inquiry'
import { InquiryStatusBadge } from './InquiryStatusBadge'
import { formatAdminDate } from '../../utils/formatDate'

interface InquiryCardProps {
  inquiry: InquiryRecord
  onClick: (inquiry: InquiryRecord) => void
}

const TYPE_LABELS: Record<InquiryRecord['inquiryType'], string> = {
  GENERAL:  'General',
  PROPERTY: 'Property',
}

export function InquiryCard({ inquiry, onClick }: InquiryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(inquiry)}
      className="w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-brand/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-800">{inquiry.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{inquiry.message}</p>
        </div>
        <InquiryStatusBadge status={inquiry.status} />
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
          {TYPE_LABELS[inquiry.inquiryType]}
        </span>
        <span>{formatAdminDate(inquiry.createdAt)}</span>
      </div>
    </button>
  )
}
