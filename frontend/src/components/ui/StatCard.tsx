import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type IconColor = 'brand' | 'emerald' | 'blue' | 'amber'

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
  iconColor?: IconColor
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

const iconColorClasses: Record<IconColor, { box: string; text: string; border: string }> = {
  brand:   { box: 'bg-brand/10',   text: 'text-brand',       border: 'border-t-brand' },
  emerald: { box: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-t-emerald-500' },
  blue:    { box: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-t-blue-500' },
  amber:   { box: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-t-amber-500' },
}

function CardContent({ icon, value, label, trend, iconColor = 'brand' }: Omit<StatCardProps, 'href' | 'className'>) {
  const colors = iconColorClasses[iconColor]
  return (
    <>
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colors.box} ${colors.text}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold ${trendColors[trend.direction]}`}>
            {trendArrows[trend.direction]} {trend.value}
          </span>
        )}
      </div>
      <div className="mt-5">
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
        <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
      </div>
    </>
  )
}

export function StatCard({ icon, value, label, href, trend, iconColor = 'brand', className = '' }: StatCardProps) {
  const colors = iconColorClasses[iconColor]
  const base = `block rounded-2xl border border-slate-200 border-t-4 ${colors.border} bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`

  if (href) {
    return (
      <Link to={href} className={`${base} ${className}`.trim()}>
        <CardContent icon={icon} value={value} label={label} trend={trend} iconColor={iconColor} />
      </Link>
    )
  }

  return (
    <div className={`${base} ${className}`.trim()}>
      <CardContent icon={icon} value={value} label={label} trend={trend} iconColor={iconColor} />
    </div>
  )
}
