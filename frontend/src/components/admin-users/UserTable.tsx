import { Link } from 'react-router-dom'
import { Spinner } from '../ui/Spinner'
import { EmptyState } from '../ui/EmptyState'
import { buttonClassName } from '../ui/Button'
import { formatAdminDate } from '../../utils/formatDate'
import { adminUserDetailPath } from '../../constants/routes'
import { UserRoleBadge } from './UserRoleBadge'
import type { User } from '../../types/auth'

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
      <EmptyState
        title="No users found"
        description="No users match your current filters. Try adjusting your search or role filter."
      />
    )
  }

  return (
    <table className="min-w-full divide-y divide-slate-100">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            Name
          </th>
          <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">
            Email
          </th>
          <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">
            Role
          </th>
          <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">
            Joined
          </th>
          <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {users.map((u) => (
          <tr key={u._id} className="transition-colors hover:bg-slate-50">
            <td className="px-6 py-4 text-sm font-medium text-slate-800">{u.name}</td>
            <td className="hidden px-6 py-4 text-sm text-slate-600 sm:table-cell">{u.email}</td>
            <td className="hidden px-6 py-4 lg:table-cell">
              <UserRoleBadge role={u.role} displayRole={u.displayRole} />
            </td>
            <td className="hidden px-6 py-4 text-sm text-slate-500 lg:table-cell">
              {formatAdminDate(u.createdAt)}
            </td>
            <td className="px-6 py-4 text-right">
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
