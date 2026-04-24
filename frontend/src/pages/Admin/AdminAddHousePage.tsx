import { AdminShell } from '../../components/layout/AdminShell'
import { PageHeader } from '../../components/layout/PageHeader'
import { AddPropertyForm } from '../../components/add-property/AddPropertyForm'
import { BackButton } from '../../components/ui/BackButton'

export function AdminAddHousePage() {
  return (
    <AdminShell
      header={
        <div>
          <BackButton className="mb-3" />
          <PageHeader title="Add Property" description="Create a new listing." />
        </div>
      }
    >
      <AddPropertyForm />
    </AdminShell>
  )
}
