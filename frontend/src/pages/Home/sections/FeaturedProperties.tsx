import { PropertyCard } from '../../../components/ui/PropertyCard'
import { Button } from '../../../components/ui/Button'
import { FEATURED_PROPERTIES } from '../../../constants/mockProperties'

export function FeaturedProperties() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">
              Hand-picked for you
            </span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Featured Listings
            </h2>
            <p className="mt-2 max-w-lg text-slate-600">
              A curated selection of premier properties available across Sri Lanka.
            </p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            View All Listings
          </Button>
        </div>

        {/* Property grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
