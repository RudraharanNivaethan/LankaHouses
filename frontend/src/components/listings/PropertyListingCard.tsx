import { Link } from 'react-router-dom'
import type { PropertyRecord } from '../../types/property'
import { StatusBadge } from '../ui/StatusBadge'
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/property'
import { ROUTES, listingDetailPath } from '../../constants/routes'

interface PropertyListingCardProps {
  property: PropertyRecord
  variant: 'admin' | 'public'
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `Rs. ${(price / 1_000_000).toFixed(1)}M`
  return `Rs. ${price.toLocaleString('en-LK')}`
}

export function PropertyListingCard({ property, variant }: PropertyListingCardProps) {
  const thumbnail = property.images[0]?.url
  const detailPath =
    variant === 'admin'
      ? ROUTES.ADMIN_HOUSE_DETAIL.replace(':id', property._id)
      : listingDetailPath(property._id)

  const listingTypeLabel = property.listingType === 'sale' ? 'For sale' : 'For rent'

  return (
    <Link
      to={detailPath}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 md:h-52">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}

        {/* Property type badge — top left */}
        <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
          {property.type}
        </span>

        {/* Listing type pill — bottom left (public only) */}
        {variant === 'public' && (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-sm">
            {listingTypeLabel}
          </div>
        )}

        {/* Status badge — top right (admin only) */}
        {variant === 'admin' && (
          <div className="absolute top-3 right-3">
            <StatusBadge
              status={property.status}
              label={STATUS_LABELS[property.status]}
              colors={STATUS_COLORS[property.status]}
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xl font-bold text-brand">{formatPrice(property.price)}</p>

        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-slate-800 transition-colors group-hover:text-brand">
          {property.title}
        </h2>

        <p className="flex items-center gap-1.5 text-sm text-slate-500">
          <svg className="h-4 w-4 shrink-0 text-brand" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {property.district}, {property.province}
        </p>

        <div className="mt-auto flex items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {property.bedrooms} bd
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {property.bathrooms} ba
          </span>
          <span className="ml-auto text-xs text-slate-400">{property.area.toLocaleString()} sq ft</span>
        </div>
      </div>
    </Link>
  )
}
