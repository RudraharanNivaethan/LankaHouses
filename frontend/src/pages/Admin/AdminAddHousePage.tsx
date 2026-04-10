import { AdminLayout } from '../../components/layout/AdminLayout'
import { PageHeader } from '../../components/layout/PageHeader'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'
import { AddPropertyForm } from '../../components/add-property/AddPropertyForm'

export function AdminAddHousePage() {
  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="flex flex-col gap-7">
        <PageHeader
          title="Add Property"
          description="Create a new listing."
        />
        <AddPropertyForm />
      </div>
    </AdminLayout>
  )
}
