import type { ReactNode } from 'react'

interface PlaceholderPageProps {
  icon: ReactNode
  title: string
  description: string
  badge?: string
}

export function PlaceholderPage({
  icon,
  title,
  description,
  badge = 'Coming Soon',
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {icon}
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-700">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      <span className="mt-4 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
        {badge}
      </span>
    </div>
  )
}
