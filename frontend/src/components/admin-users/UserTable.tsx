import { Link } from 'react-router-dom'
import { Spinner } from '../ui/Spinner'
import { buttonClassName } from '../ui/Button'
import { formatAdminDate } from '../../utils/formatDate'
import { adminUserDetailPath } from '../../constants/routes'
import type { User, UserRole } from '../../types/auth'

const ROLE_BADGE: Record<UserRole, string> = {
  user:       'bg-slate-100 text-slate-600',
  admin:      'bg-blue-100 text-blue-700',
  superadmin: 'bg-brand/10 text-brand',
}

interface UserTableProps {
  users: User[]
  isLoading: boolean
}

export function UserTable({ users, isLoading }: UserTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-brand" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400">No users found.</div>
    )
  }

  return (
    <table className="min-w-full divide-y divide-slate-100">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Joined</th>
          <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {users.map((u) => (
          <tr key={u._id} className="transition-colors hover:bg-slate-50">
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">{u.name}</td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{u.email}</td>
            <td className="whitespace-nowrap px-6 py-4">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[u.role]}`}>
                {u.displayRole}
              </span>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
              {formatAdminDate(u.createdAt)}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-right">
              <Link
                to={adminUserDetailPath(u._id)}
                className={buttonClassName('outline', 'sm')}
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
