import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarLinkProps {
  to: string
  icon: ReactNode
  label: string
  badge?: number
  end?: boolean
  collapsed?: boolean
}

export function SidebarLink({ to, icon, label, badge, end, collapsed = false }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-brand/10 text-brand'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          collapsed ? 'justify-center' : '',
        ].join(' ')
      }
    >
      <span className="h-5 w-5 shrink-0">{icon}</span>
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && badge !== undefined && badge > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  )
}
