import { useLocation } from 'react-router-dom'
import { SectionContainer } from '../../components/layout/SectionContainer'
import { PageHeader } from '../../components/layout/PageHeader'
import { PropertyListingList } from '../../components/listings/PropertyListingList'

export function ListingsPage() {
  const location = useLocation()

  return (
    <SectionContainer className="flex flex-1 flex-col gap-8 py-10 sm:py-12">
      <PageHeader
        title="Browse listings"
        description="Verified properties across Sri Lanka. Filter by type, listing, or search by location and keywords."
      />
      <PropertyListingList key={location.search} variant="public" />
    </SectionContainer>
  )
}
