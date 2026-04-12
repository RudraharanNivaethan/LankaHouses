import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { PageHeader } from '../../components/layout/PageHeader'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'
import { PropertyListView } from '../../components/admin-houses/PropertyListView'
import { Button } from '../../components/ui/Button'
import { SearchBar } from '../../components/ui/SearchBar'
import { ROUTES } from '../../constants/routes'

export function AdminHousesPage() {
  const location = useLocation()
  const [listingSearch, setListingSearch] = useState('')

  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="flex flex-col gap-7">
        <PageHeader
          title="Houses"
          description="Manage your property listings."
          actions={
            <Link to={ROUTES.ADMIN_ADD_HOUSE}>
              <Button variant="primary" size="md">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Property
              </Button>
            </Link>
          }
        />

        <div className="w-full min-w-0">
          <SearchBar
            placeholder="Search listings…"
            aria-label="Search property listings"
            value={listingSearch}
            onChange={(e) => setListingSearch(e.target.value)}
            onClear={() => setListingSearch('')}
          />
        </div>

        <PropertyListView key={location.search} />
      </div>
    </AdminLayout>
  )
}
