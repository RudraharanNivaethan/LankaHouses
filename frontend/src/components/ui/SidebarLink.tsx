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
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-brand/20 text-brand-light shadow-sm'
            : 'text-slate-400 hover:bg-white/8 hover:text-white',
          collapsed ? 'justify-center' : '',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <span className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-brand-light' : 'text-slate-500 group-hover:text-white'}`}>
            {icon}
          </span>
          {!collapsed && <span className="flex-1 truncate">{label}</span>}
          {!collapsed && badge !== undefined && badge > 0 && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-bold text-white shadow-sm shadow-brand/50">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
