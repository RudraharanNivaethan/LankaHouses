import { AdminLayout } from '../../components/layout/AdminLayout'
import { PageHeader } from '../../components/layout/PageHeader'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'
import { PropertyEditForm } from '../../components/admin-houses/PropertyEditForm'

export function AdminEditHousePage() {
  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="flex flex-col gap-7">
        <PageHeader
          title="Edit Property"
          description="Update an existing property listing."
        />
        <PropertyEditForm />
      </div>
    </AdminLayout>
  )
}
