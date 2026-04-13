import { Link } from 'react-router-dom'
import { PropertyCard } from '../ui/PropertyCard'
import { SectionHeader } from '../ui/SectionHeader'
import { SectionContainer } from '../layout/SectionContainer'
import { FEATURED_PROPERTIES } from '../../constants/mockProperties'
import { ROUTES } from '../../constants/routes'

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
          <Link
            to={ROUTES.LISTINGS}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-brand px-4 py-2 text-sm font-semibold text-brand transition-all duration-200 hover:bg-brand hover:text-white active:scale-95"
          >
            View All Listings
          </Link>
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
