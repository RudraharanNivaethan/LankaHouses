import { AdminShell } from '../../components/layout/AdminShell'
import { PageHeader } from '../../components/layout/PageHeader'
import { AddPropertyForm } from '../../components/add-property/AddPropertyForm'

export function AdminAddHousePage() {
  return (
    <AdminShell
      header={<PageHeader title="Add Property" description="Create a new listing." />}
    >
      <AddPropertyForm />
    </AdminShell>
  )
}
