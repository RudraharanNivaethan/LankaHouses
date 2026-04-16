import { Link } from 'react-router-dom'
import { useProperties } from '../../hooks/useProperties'
import { HorizontalScroller } from '../ui/HorizontalScroller'
import { PropertySliderCard } from './PropertySliderCard'
import { SLIDER_LIMIT } from '../../constants/property'
import { ROUTES } from '../../constants/routes'

function SliderSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-72 shrink-0 animate-pulse rounded-2xl border border-slate-200/80 bg-surface">
          <div className="h-44 w-full rounded-t-2xl bg-slate-200" />
          <div className="flex flex-col gap-2 p-4">
            <div className="h-4 w-24 rounded-full bg-slate-200" />
            <div className="h-4 w-48 rounded-full bg-slate-200" />
            <div className="h-3 w-32 rounded-full bg-slate-200" />
            <div className="h-3 w-40 rounded-full bg-slate-200" />
            <div className="mt-3 h-8 w-full rounded-lg bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function PropertySlider() {
  const { properties, isLoading } = useProperties({ page: 1, limit: SLIDER_LIMIT })

  if (!isLoading && properties.length === 0) return null

  return (
    <div className="rounded-2xl border border-slate-200/50 bg-surface p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">New arrivals</p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Recently listed
          </h2>
        </div>
        <Link
          to={ROUTES.LISTINGS}
          className="shrink-0 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <SliderSkeleton />
      ) : (
        <HorizontalScroller label="Recently listed properties" scrollStep={288}>
          {properties.map((property) => (
            <PropertySliderCard key={property._id} property={property} />
          ))}
        </HorizontalScroller>
      )}
    </div>
  )
}
