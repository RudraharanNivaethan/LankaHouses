import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  /** Small label above the title (e.g. section context). */
  eyebrow?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, eyebrow, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">{eyebrow}</p>
        )}
        <h1 className={`text-2xl font-bold tracking-tight text-slate-900 ${eyebrow ? 'mt-2' : ''}`}>
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  )
}
