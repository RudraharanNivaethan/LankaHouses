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
  return price.toLocaleString('en-LK')
}

export function PropertyListingCard({ property, variant }: PropertyListingCardProps) {
  const thumbnail = property.images[0]?.url
  const detailPath =
    variant === 'admin'
      ? ROUTES.ADMIN_HOUSE_DETAIL.replace(':id', property._id)
      : listingDetailPath(property._id)

  return (
    <Link
      to={detailPath}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
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

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900 group-hover:text-brand transition-colors">
            {property.title}
          </h2>
          <span className="shrink-0 rounded-full bg-brand/8 px-2.5 py-1 text-[11px] font-semibold text-brand">
            LKR {formatPrice(property.price)}
          </span>
        </div>

        <div className="text-sm text-slate-600">
          <span className="font-medium text-slate-500">{property.type}</span>
          {' · '}
          <span className="capitalize">{property.listingType}</span>
        </div>

        <div className="text-sm text-slate-600">
          {property.district}, {property.province}
        </div>

        <div className="flex gap-3 text-xs text-slate-500">
          <span>{property.bedrooms} bed</span>
          <span className="text-slate-300">|</span>
          <span>{property.bathrooms} bath</span>
          <span className="text-slate-300">|</span>
          <span>{property.parkingSpaces} parking</span>
        </div>
      </div>
    </Link>
  )
}
