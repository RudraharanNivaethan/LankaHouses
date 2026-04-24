import { Link, useSearchParams } from 'react-router-dom'
import { AdminShell } from '../../components/layout/AdminShell'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Pagination } from '../../components/ui/Pagination'
import { PlusIcon } from '../../components/ui/icons'
import { UserRoleFilter } from '../../components/admin-users/UserRoleFilter'
import { UserTable } from '../../components/admin-users/UserTable'
import { useUsers } from '../../hooks/useUsers'
import { ROUTES } from '../../constants/routes'
import { isUserRole } from '../../constants/roles'
import type { UserRole } from '../../types/auth'

export function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const roleParam = searchParams.get('role')
  const roleFilter: UserRole | undefined = isUserRole(roleParam) ? roleParam : undefined

  const { users, pagination, page, setPage, isLoading, error } = useUsers(roleFilter)

  const handleRoleChange = (role: UserRole | undefined) => {
    setSearchParams(role ? { role } : {}, { replace: true })
    setPage(1)
  }

  const header = (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          {pagination ? `${pagination.total} total users` : 'Loading...'}
        </p>
      </div>
      <Link
        to={ROUTES.ADMIN_CREATE_ADMIN}
        className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
      >
        <PlusIcon className="h-4 w-4" />
        Create Admin
      </Link>
    </div>
  )

  return (
    <AdminShell header={header} gap="sm">
      <AlertBanner message={error} />

      <UserRoleFilter active={roleFilter} onChange={handleRoleChange} />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <UserTable users={users} isLoading={isLoading} />
      </div>

      {pagination && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </AdminShell>
  )
}
