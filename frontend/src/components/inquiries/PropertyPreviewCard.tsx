import { Link } from 'react-router-dom'
import type { PropertyRecord } from '../../types/property'
import { Skeleton } from '../ui/Skeleton'

interface PropertyPreviewCardProps {
  property: PropertyRecord | null
  isLoading?: boolean
  /** When provided, the card becomes a navigable link. */
  linkTo?: string
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `Rs. ${(price / 1_000_000).toFixed(1)}M`
  return `Rs. ${price.toLocaleString()}`
}

const BASE_CLASSES =
  'flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all'

const LINK_EXTRA_CLASSES =
  'hover:border-brand/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

export function PropertyPreviewCard({ property, isLoading = false, linkTo }: PropertyPreviewCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-20 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (!property) return null

  const content = (
    <>
      {property.images[0] && (
        <img
          src={property.images[0].url}
          alt={property.title}
          className="h-16 w-20 shrink-0 rounded-lg object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{property.title}</p>
        <p className="mt-0.5 text-xs text-slate-500">
          {property.district}, {property.province}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs">
          <span className="font-medium text-brand">{formatPrice(property.price)}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">{property.type}</span>
          <span className="text-slate-400">·</span>
          <span className="capitalize text-slate-500">{property.listingType}</span>
        </div>
        {linkTo && (
          <p className="mt-1.5 text-xs font-medium text-brand">View property →</p>
        )}
      </div>
    </>
  )

  if (linkTo) {
    return (
      <Link to={linkTo} className={`${BASE_CLASSES} ${LINK_EXTRA_CLASSES}`}>
        {content}
      </Link>
    )
  }

  return <div className={BASE_CLASSES}>{content}</div>
}
