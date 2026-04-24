import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../context/AuthContext'
import {
  PlusIcon,
  InquiriesIcon,
  UserPlusIcon,
  ChevronRightIcon,
} from '../ui/icons'

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
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
    </Link>
  )
}

/**
 * Dashboard quick-action grid. Capability flags (e.g. who can create admins)
 * come from the backend-supplied `user.permissions` object — never derived
 * here. No per-page props.
 */
export function QuickActions() {
  const { user } = useAuth()
  const canCreateAdmin = user?.permissions.includes('admins.create') ?? false

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Actions</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ActionCard
          to={ROUTES.ADMIN_ADD_HOUSE}
          icon={<PlusIcon className="h-5 w-5" />}
          title="Add New Property"
          description="Create a new listing with photos and details"
        />
        <ActionCard
          to={ROUTES.ADMIN_INQUIRIES}
          icon={<InquiriesIcon className="h-5 w-5" />}
          title="View All Inquiries"
          description="Review and respond to buyer inquiries"
          accent="text-blue-600"
        />
        {canCreateAdmin && (
          <ActionCard
            to={ROUTES.ADMIN_CREATE_ADMIN}
            icon={<UserPlusIcon className="h-5 w-5" />}
            title="Create Admin"
            description="Add a new admin account to the system"
            accent="text-emerald-600"
          />
        )}
      </div>
    </div>
  )
}
