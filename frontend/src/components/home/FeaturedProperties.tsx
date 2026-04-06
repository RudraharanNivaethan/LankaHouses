import { PropertyCard } from '../ui/PropertyCard'
import { Button } from '../ui/Button'
import { SectionHeader } from '../ui/SectionHeader'
import { SectionContainer } from '../layout/SectionContainer'
import { FEATURED_PROPERTIES } from '../../constants/mockProperties'

export function FeaturedProperties() {
  return (
    <section className="bg-white py-20">
      <SectionContainer>
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Hand-picked for you"
            title="Featured Listings"
            description="A curated selection of premier properties available across Sri Lanka."
            align="left"
          />
          <Button variant="outline" size="sm" className="shrink-0">
            View All Listings
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
