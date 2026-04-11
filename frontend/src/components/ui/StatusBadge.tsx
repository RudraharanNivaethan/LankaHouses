interface StatusConfig {
  bg: string
  text: string
  dot: string
}

interface StatusBadgeProps {
  status: string
  label: string
  colors: StatusConfig
}

export function StatusBadge({ label, colors }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} aria-hidden="true" />
      {label}
    </span>
  )
}
