import type { UserRole } from '../../types/auth'

const ROLE_BADGE: Record<UserRole, string> = {
  user:       'bg-slate-100 text-slate-600',
  admin:      'bg-blue-100 text-blue-700',
  superadmin: 'bg-brand/10 text-brand',
}

interface UserRoleBadgeProps {
  role: UserRole
  displayRole: string
}

export function UserRoleBadge({ role, displayRole }: UserRoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[role]}`}
    >
      {displayRole}
    </span>
  )
}
