import { Link } from 'react-router-dom'
import { PropertyCard } from '../ui/PropertyCard'
import { SectionHeader } from '../ui/SectionHeader'
import { SectionContainer } from '../layout/SectionContainer'
import { Spinner } from '../ui/Spinner'
import { AlertBanner } from '../ui/AlertBanner'
import { useProperties } from '../../hooks/useProperties'
import { FEATURED_HOME_LIMIT } from '../../constants/property'
import { ROUTES, listingDetailPath } from '../../constants/routes'
import { propertyRecordToFeaturedCardProperty } from '../../utils/propertyCardMapper'

/**
 * Shows the newest active listings (API sort: createdAt desc). There is no `featured` flag yet;
 * replace with a dedicated query when the backend supports it.
 */
export function FeaturedProperties() {
  const { properties, isLoading, error } = useProperties({
    page: 1,
    limit: FEATURED_HOME_LIMIT,
  })

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
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-brand px-4 py-2 text-sm font-semibold text-brand transition-all duration-200 hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            View All Listings
          </Link>
        </div>

        <AlertBanner message={error} />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-8 w-8 text-brand" />
          </div>
        ) : error ? null : properties.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((record) => {
              const card = propertyRecordToFeaturedCardProperty(record)
              return (
                <Link
                  key={record._id}
                  to={listingDetailPath(record._id)}
                  className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <PropertyCard property={card} />
                </Link>
              )
            })}
          </div>
        )}
      </SectionContainer>
    </section>
  )
}
