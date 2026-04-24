import { AdminShell } from '../../components/layout/AdminShell'
import { PropertyDetailView } from '../../components/admin-houses/PropertyDetailView'

export function AdminHouseDetailPage() {
  return (
    <AdminShell gap="none">
      <PropertyDetailView />
    </AdminShell>
  )
}
