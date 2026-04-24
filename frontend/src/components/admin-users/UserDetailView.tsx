import { Link, useParams } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { Spinner } from '../ui/Spinner'
import { AlertBanner } from '../ui/AlertBanner'
import { formatAdminDate } from '../../utils/formatDate'
import { ROUTES } from '../../constants/routes'
import type { UserRole } from '../../types/auth'

const ROLE_BADGE: Record<UserRole, string> = {
  user:       'bg-slate-100 text-slate-600',
  admin:      'bg-blue-100 text-blue-700',
  superadmin: 'bg-brand/10 text-brand',
}

interface InfoRowProps {
  label: string
  value: React.ReactNode
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="grid grid-cols-3 gap-4 py-4">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="col-span-2 text-sm text-slate-800">{value}</dd>
    </div>
  )
}

export function UserDetailView() {
  const { id } = useParams<{ id: string }>()
  const { user, isLoading, error } = useUser(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="h-8 w-8 text-brand" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex flex-col gap-4">
        <AlertBanner message={error ?? 'User not found.'} />
        <Link
          to={ROUTES.ADMIN_USERS}
          className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
        >
          ← Back to Users
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={ROUTES.ADMIN_USERS}
        className="self-start text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
      >
        ← Back to Users
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-800">Profile</h2>
        </div>
        <dl className="divide-y divide-slate-100 px-6">
          <InfoRow label="Name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow
            label="Role"
            value={
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[user.role]}`}
              >
                {user.displayRole}
              </span>
            }
          />
          <InfoRow label="Phone" value={user.phone ?? '—'} />
          <InfoRow
            label="Registered"
            value={user.createdAt ? formatAdminDate(user.createdAt) : '—'}
          />
        </dl>
      </div>
    </div>
  )
}
