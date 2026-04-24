import { Link, useLocation } from 'react-router-dom'
import { AdminShell } from '../../components/layout/AdminShell'
import { PageHeader } from '../../components/layout/PageHeader'
import { PropertyListView } from '../../components/admin-houses/PropertyListView'
import { Button } from '../../components/ui/Button'
import { PlusIcon } from '../../components/ui/icons'
import { ROUTES } from '../../constants/routes'

export function AdminHousesPage() {
  const location = useLocation()

  return (
    <AdminShell
      header={
        <PageHeader
          title="Houses"
          description="Manage your property listings."
          actions={
            <Link to={ROUTES.ADMIN_ADD_HOUSE}>
              <Button variant="primary" size="md">
                <PlusIcon className="h-4 w-4" />
                Add Property
              </Button>
            </Link>
          }
        />
      }
    >
      <PropertyListView key={location.search} />
    </AdminShell>
  )
}
