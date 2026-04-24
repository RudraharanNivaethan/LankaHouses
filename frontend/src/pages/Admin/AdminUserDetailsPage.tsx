import { AdminShell } from '../../components/layout/AdminShell'
import { PageHeader } from '../../components/layout/PageHeader'
import { UserDetailView } from '../../components/admin-users/UserDetailView'

export function AdminUserDetailsPage() {
  return (
    <AdminShell
      header={
        <PageHeader
          title="User Details"
          description="Full profile information for this user."
        />
      }
    >
      <UserDetailView />
    </AdminShell>
  )
}
