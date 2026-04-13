import { Link } from 'react-router-dom'
import { useProperties } from '../../hooks/useProperties'
import { Spinner } from '../../components/ui/Spinner'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { EmptyState } from '../../components/ui/EmptyState'
import { Pagination } from '../../components/ui/Pagination'
import { ROUTES } from '../../constants/routes'
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/property'
import { StatusBadge } from '../../components/ui/StatusBadge'
import type { PropertyRecord } from '../../types/property'

function formatPrice(price: number): string {
  return price.toLocaleString('en-LK')
}

function ListingCard({ property }: { property: PropertyRecord }) {
  const thumb = property.images[0]?.url
  const detailPath = ROUTES.LISTING_DETAIL.replace(':id', property._id)

  return (
    <Link
      to={detailPath}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {thumb ? (
          <img
            src={thumb}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge
            status={property.status}
            label={STATUS_LABELS[property.status]}
            colors={STATUS_COLORS[property.status]}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="text-base font-semibold text-slate-900 group-hover:text-brand transition-colors">
          {property.title}
        </h2>
        <p className="text-sm text-brand font-semibold">LKR {formatPrice(property.price)}</p>
        <p className="text-sm text-slate-600">
          {property.district}, {property.province}
        </p>
        <p className="mt-auto text-xs text-slate-500">
          {property.bedrooms} bed · {property.bathrooms} bath · {property.type}
        </p>
      </div>
    </Link>
  )
}

export function ListingsPage() {
  const { properties, pagination, isLoading, error, setPage } = useProperties({})

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Browse listings</h1>
        <p className="mt-2 text-slate-600">
          Available properties for sale and rent. Sold listings stay visible; inquiries are closed for those.
        </p>
      </div>

      <AlertBanner message={error} />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-10 w-10 text-brand" />
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          title="No listings yet"
          description="Check back soon for new properties."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((p) => (
              <ListingCard key={p._id} property={p} />
            ))}
          </div>
          <div className="mt-8">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  )
}
