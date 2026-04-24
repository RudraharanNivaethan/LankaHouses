import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

interface ActionCardProps {
  to: string
  icon: ReactNode
  title: string
  description: string
  accent?: string
}

function ActionCard({ to, icon, title, description, accent = 'text-brand' }: ActionCardProps) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/8 ${accent} transition-colors group-hover:bg-brand group-hover:text-white`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-0.5 text-xs text-slate-500 truncate">{description}</p>
      </div>
      <svg
        className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

interface QuickActionsProps {
  showCreateAdmin?: boolean
}

export function QuickActions({ showCreateAdmin = false }: QuickActionsProps) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Actions</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ActionCard
          to={ROUTES.ADMIN_ADD_HOUSE}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
          title="Add New Property"
          description="Create a new listing with photos and details"
        />
        <ActionCard
          to={ROUTES.ADMIN_INQUIRIES}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
          title="View All Inquiries"
          description="Review and respond to buyer inquiries"
          accent="text-blue-600"
        />
        {showCreateAdmin && (
          <ActionCard
            to={ROUTES.ADMIN_CREATE_ADMIN}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            }
            title="Create Admin"
            description="Add a new admin account to the system"
            accent="text-emerald-600"
          />
        )}
      </div>
    </div>
  )
}
