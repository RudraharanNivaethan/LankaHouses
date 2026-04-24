import { Link, useLocation } from 'react-router-dom'
import { AdminShell } from '../../components/layout/AdminShell'
import { PageHeader } from '../../components/layout/PageHeader'
import { UserListView } from '../../components/admin-users/UserListView'
import { Button } from '../../components/ui/Button'
import { PlusIcon } from '../../components/ui/icons'
import { ROUTES } from '../../constants/routes'

export function AdminUsersPage() {
  const location = useLocation()

  return (
    <AdminShell
      header={
        <PageHeader
          title="Users"
          description="Manage user accounts and roles."
          actions={
            <Link to={ROUTES.ADMIN_CREATE_ADMIN}>
              <Button variant="primary" size="md">
                <PlusIcon className="h-4 w-4" />
                Create Admin
              </Button>
            </Link>
          }
        />
      }
    >
      <UserListView key={location.search} />
    </AdminShell>
  )
}
