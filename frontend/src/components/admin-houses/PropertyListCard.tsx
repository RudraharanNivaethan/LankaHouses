import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { PropertyRecord, PropertyStatus } from '../../types/property'
import { StatusBadge } from '../ui/StatusBadge'
import { STATUS_LABELS, STATUS_COLORS, PROPERTY_STATUSES } from '../../constants/property'
import { ROUTES } from '../../constants/routes'
import { updateProperty } from '../../services/propertyService'

interface PropertyListCardProps {
  property: PropertyRecord
  onStatusUpdated?: () => void
}

function formatPrice(price: number): string {
  return price.toLocaleString('en-LK')
}

const statusSelectOptions = PROPERTY_STATUSES.map((s) => ({
  value: s,
  label: STATUS_LABELS[s],
}))

export function PropertyListCard({ property, onStatusUpdated }: PropertyListCardProps) {
  const thumbnail = property.images[0]?.url
  const detailPath = ROUTES.ADMIN_HOUSE_DETAIL.replace(':id', property._id)
  const selectId = `property-status-${property._id}`

  const [localStatus, setLocalStatus] = useState<PropertyStatus>(property.status)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    setLocalStatus(property.status)
  }, [property.status, property._id])

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as PropertyStatus
    if (next === property.status) return
    setSaving(true)
    setErr(null)
    try {
      await updateProperty(property._id, { status: next })
      setLocalStatus(next)
      onStatusUpdated?.()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not update status.')
      setLocalStatus(property.status)
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to={detailPath}
        className="group block"
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
          <div className="absolute top-3 right-3">
            <StatusBadge
              status={localStatus}
              label={STATUS_LABELS[localStatus]}
              colors={STATUS_COLORS[localStatus]}
            />
          </div>
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

      <div
        className="border-t border-slate-100 px-5 pb-4 pt-3"
        onClick={(e) => e.stopPropagation()}
      >
        <label htmlFor={selectId} className="mb-1.5 block text-xs font-medium text-slate-600">
          Listing status
        </label>
        <select
          id={selectId}
          value={localStatus}
          disabled={saving}
          onChange={(e) => void handleStatusChange(e)}
          className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all hover:border-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
        >
          {statusSelectOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {err ? <p className="mt-1.5 text-xs text-red-600">{err}</p> : null}
      </div>
    </article>
  )
}
