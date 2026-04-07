import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface TrendProps {
  value: string
  direction: 'up' | 'down' | 'neutral'
}

interface StatCardProps {
  icon: ReactNode
  value: string | number
  label: string
  href?: string
  trend?: TrendProps
  className?: string
}

const trendColors: Record<TrendProps['direction'], string> = {
  up: 'text-emerald-600',
  down: 'text-red-500',
  neutral: 'text-slate-400',
}

const trendArrows: Record<TrendProps['direction'], string> = {
  up: '↑',
  down: '↓',
  neutral: '→',
}

function CardContent({ icon, value, label, trend }: Omit<StatCardProps, 'href' | 'className'>) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trendColors[trend.direction]}`}>
            {trendArrows[trend.direction]} {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="mt-0.5 text-sm text-slate-500">{label}</p>
      </div>
    </>
  )
}

export function StatCard({ icon, value, label, href, trend, className = '' }: StatCardProps) {
  const base =
    'block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'

  if (href) {
    return (
      <Link to={href} className={`${base} ${className}`.trim()}>
        <CardContent icon={icon} value={value} label={label} trend={trend} />
      </Link>
    )
  }

  return (
    <div className={`${base} ${className}`.trim()}>
      <CardContent icon={icon} value={value} label={label} trend={trend} />
    </div>
  )
}
