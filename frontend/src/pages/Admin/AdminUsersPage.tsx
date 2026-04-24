import { Link, useSearchParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Pagination } from '../../components/ui/Pagination'
import { UserRoleFilter } from '../../components/adminUsers/UserRoleFilter'
import { UserTable } from '../../components/adminUsers/UserTable'
import { useUsers } from '../../hooks/useUsers'
import { ROUTES } from '../../constants/routes'
import type { UserRole } from '../../types/auth'

function isUserRole(value: string | null): value is UserRole {
  return value === 'user' || value === 'admin' || value === 'superadmin'
}

export function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const roleParam = searchParams.get('role')
  const roleFilter: UserRole | undefined = isUserRole(roleParam) ? roleParam : undefined

  const { users, pagination, page, setPage, isLoading, error } = useUsers(roleFilter)

  const handleRoleChange = (role: UserRole | undefined) => {
    setSearchParams(role ? { role } : {}, { replace: true })
    setPage(1)
  }

  return (
    <AdminLayout sidebar={<AdminSidebar isSuperAdmin />}>
      <div className="flex flex-col gap-6">
        {/* Header */}
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
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Admin
          </Link>
        </div>

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
      </div>
    </AdminLayout>
  )
}
