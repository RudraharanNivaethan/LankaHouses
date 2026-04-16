import { Link } from 'react-router-dom'
import type { PropertyRecord } from '../../types/property'
import { buttonClassName } from '../ui/Button'
import { listingDetailPath } from '../../constants/routes'

interface PropertySliderCardProps {
  property: PropertyRecord
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `LKR ${(price / 1_000_000).toFixed(1)}M`
  return `LKR ${price.toLocaleString('en-LK')}`
}

export function PropertySliderCard({ property }: PropertySliderCardProps) {
  const thumbnail = property.images[0]?.url
  const listingTypeLabel = property.listingType === 'sale' ? 'For sale' : 'For rent'
  const detailPath = listingDetailPath(property._id)

  return (
    <div className="group flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-surface shadow-sm ring-1 ring-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:ring-slate-300/80">
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
        <div className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-sm">
          {listingTypeLabel}
        </div>
        <div className="absolute top-3 right-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow">
          {property.type}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-base font-bold text-brand">{formatPrice(property.price)}</p>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800">
          {property.title}
        </h3>

        <p className="flex items-center gap-1 text-xs text-slate-500">
          <svg className="h-3.5 w-3.5 shrink-0 text-brand" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {property.district}, {property.province}
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {property.bedrooms} bed
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {property.bathrooms} bath
          </span>
          <span className="ml-auto text-[11px] text-slate-400">{property.area.toLocaleString()} sq ft</span>
        </div>

        <div className="mt-auto pt-2">
          <Link
            to={detailPath}
            className={buttonClassName('outline', 'sm', 'w-full justify-center text-xs')}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
