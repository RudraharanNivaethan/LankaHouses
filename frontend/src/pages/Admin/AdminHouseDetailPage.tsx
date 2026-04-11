import { AdminLayout } from '../../components/layout/AdminLayout'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'
import { PropertyDetailView } from '../../components/admin-houses/PropertyDetailView'

export function AdminHouseDetailPage() {
  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <PropertyDetailView />
    </AdminLayout>
  )
}
