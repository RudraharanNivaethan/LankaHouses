import { useLocation } from 'react-router-dom'
import { ListingsBrowseShell } from '../../components/layout/ListingsBrowseShell'
import { SectionContainer } from '../../components/layout/SectionContainer'
import { PageHeader } from '../../components/layout/PageHeader'
import { PropertyListingList } from '../../components/listings/PropertyListingList'

export function ListingsPage() {
  const location = useLocation()

  return (
    <ListingsBrowseShell>
      <SectionContainer className="flex flex-1 flex-col gap-6 py-10 sm:py-12">
        <div className="rounded-2xl border border-slate-200/50 bg-gradient-to-br from-listings-banner-from to-listings-banner-to px-6 py-7 shadow-sm ring-1 ring-slate-200/50 sm:px-8 sm:py-8">
          <PageHeader
            eyebrow="Explore"
            title="Browse listings"
            description="Verified properties across Sri Lanka. Filter by type, listing, or search by location and keywords."
          />
        </div>
        <PropertyListingList key={location.search} variant="public" />
      </SectionContainer>
    </ListingsBrowseShell>
  )
}
