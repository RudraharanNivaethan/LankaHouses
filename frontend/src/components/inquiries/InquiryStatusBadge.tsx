import type { InquiryStatus } from '../../types/inquiry'
import { StatusBadge } from '../ui/StatusBadge'

interface StatusConfig {
  bg: string
  text: string
  dot: string
}

const STATUS_COLORS: Record<InquiryStatus, StatusConfig> = {
  PENDING: {
    bg:  'bg-yellow-50',
    text: 'text-yellow-700',
    dot:  'bg-yellow-500',
  },
  REPLIED: {
    bg:  'bg-green-50',
    text: 'text-green-700',
    dot:  'bg-green-500',
  },
  CLOSED: {
    bg:  'bg-slate-100',
    text: 'text-slate-500',
    dot:  'bg-slate-400',
  },
}

const STATUS_LABELS: Record<InquiryStatus, string> = {
  PENDING: 'Pending',
  REPLIED: 'Replied',
  CLOSED:  'Closed',
}

interface InquiryStatusBadgeProps {
  status: InquiryStatus
}

export function InquiryStatusBadge({ status }: InquiryStatusBadgeProps) {
  return (
    <StatusBadge
      status={status}
      label={STATUS_LABELS[status]}
      colors={STATUS_COLORS[status]}
    />
  )
}
