import type { ReactNode } from 'react'

interface DetailSectionProps {
  title: string
  children: ReactNode
  columns?: 1 | 2 | 3
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
} as const

export function DetailSection({ title, children, columns = 2 }: DetailSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-800">{title}</h2>
      <dl className={`grid gap-4 ${columnClasses[columns]}`}>
        {children}
      </dl>
    </section>
  )
}
