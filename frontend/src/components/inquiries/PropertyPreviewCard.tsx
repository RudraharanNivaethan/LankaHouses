import type { PropertyRecord } from '../../types/property'

interface PropertyPreviewCardProps {
  property: PropertyRecord | null
  isLoading?: boolean
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `Rs. ${(price / 1_000_000).toFixed(1)}M`
  return `Rs. ${price.toLocaleString()}`
}

export function PropertyPreviewCard({ property, isLoading = false }: PropertyPreviewCardProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
      </div>
    )
  }

  if (!property) return null

  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
      </div>
    </div>
  )
}
