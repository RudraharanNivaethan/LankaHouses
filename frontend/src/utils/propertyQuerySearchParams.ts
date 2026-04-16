import { STATUS_LABELS } from '../constants/property'
import type {
  BackendPropertyType,
  ListingType,
  PropertyQueryParams,
  PropertyStatus,
} from '../types/property'

export type FilterChipKey = 'type' | 'listingType' | 'search' | 'status'

/** URL-serializable slice of the property list query (no page/limit). */
export function propertyQueryToSearchParams(
  q: PropertyQueryParams,
  opts: { includeStatus: boolean },
): URLSearchParams {
  const sp = new URLSearchParams()
  if (q.type) sp.set('type', q.type)
  if (q.listingType) sp.set('listingType', q.listingType)
  const search = q.search?.trim()
  if (search) sp.set('search', search)
  if (opts.includeStatus && q.status) sp.set('status', q.status)
  return sp
}

/** Strips `status` for public routes; keeps full query for admin. */
export function queryForUrlSync(q: PropertyQueryParams, variant: 'admin' | 'public'): PropertyQueryParams {
  if (variant !== 'public') return { ...q }
  const { status: _omit, ...rest } = q
  return rest
}

function listingTypeLabel(value: ListingType): string {
  return value === 'sale' ? 'Sale' : 'Rent'
}

function truncateSearch(s: string, max = 36): string {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max)}…`
}

/** Active filter chips for the quick-stats row (labels aligned with Select options / status labels). */
export function buildFilterChips(
  query: PropertyQueryParams,
  variant: 'admin' | 'public',
): { key: FilterChipKey; label: string }[] {
  const chips: { key: FilterChipKey; label: string }[] = []
  if (query.type) {
    chips.push({ key: 'type', label: `Type · ${query.type as BackendPropertyType}` })
  }
  if (query.listingType) {
    chips.push({
      key: 'listingType',
      label: `Listing · ${listingTypeLabel(query.listingType)}`,
    })
  }
  const search = query.search?.trim()
  if (search) {
    chips.push({ key: 'search', label: `Search · ${truncateSearch(search)}` })
  }
  if (variant === 'admin' && query.status) {
    chips.push({
      key: 'status',
      label: `Status · ${STATUS_LABELS[query.status as PropertyStatus]}`,
    })
  }
  return chips
}
