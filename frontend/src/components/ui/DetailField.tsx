import type { ReactNode } from 'react'

interface DetailFieldProps {
  label: string
  value: ReactNode
  icon?: ReactNode
}

export function DetailField({ label, value, icon }: DetailFieldProps) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <dt className="text-xs font-semibold text-slate-500">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium text-slate-900">{value}</dd>
      </div>
    </div>
  )
}
