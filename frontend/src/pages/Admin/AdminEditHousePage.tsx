import { AdminShell } from '../../components/layout/AdminShell'
import { PageHeader } from '../../components/layout/PageHeader'
import { PropertyEditForm } from '../../components/admin-houses/PropertyEditForm'

export function AdminEditHousePage() {
  return (
    <AdminShell
      header={
        <PageHeader
          title="Edit Property"
          description="Update an existing property listing."
        />
      }
    >
      <PropertyEditForm />
    </AdminShell>
  )
}
