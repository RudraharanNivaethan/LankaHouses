import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProperties } from '../../hooks/useProperties'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { PropertyListingCard } from './PropertyListingCard'
import { Pagination } from '../ui/Pagination'
import { EmptyState } from '../ui/EmptyState'
import { Spinner } from '../ui/Spinner'
import { AlertBanner } from '../ui/AlertBanner'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { BackButton } from '../ui/BackButton'
import { SearchBar } from '../ui/SearchBar'
import { FilterChip } from '../ui/FilterChip'
import { SectionContainer } from '../layout/SectionContainer'
import { PROPERTY_TYPES, LISTING_TYPES, PROPERTY_STATUSES } from '../../constants/property'
import { PROPERTY_SEARCH_DEBOUNCE_MS } from '../../constants/propertySearch'
import { ROUTES } from '../../constants/routes'
import {
  buildFilterChips,
  propertyQueryToSearchParams,
  queryForUrlSync,
  type FilterChipKey,
} from '../../utils/propertyQuerySearchParams'
import type { BackendPropertyType, ListingType, PropertyQueryParams, PropertyStatus } from '../../types/property'

function statusFromSearchParam(raw: string | null): PropertyStatus | undefined {
  if (!raw) return undefined
  return (PROPERTY_STATUSES as readonly string[]).includes(raw) ? (raw as PropertyStatus) : undefined
}

function typeFromSearchParam(raw: string | null): BackendPropertyType | undefined {
  if (!raw) return undefined
  return (PROPERTY_TYPES as readonly string[]).includes(raw) ? (raw as BackendPropertyType) : undefined
}

function listingTypeFromSearchParam(raw: string | null): ListingType | undefined {
  if (!raw) return undefined
  return (LISTING_TYPES as readonly string[]).includes(raw) ? (raw as ListingType) : undefined
}

function searchFromSearchParam(raw: string | null): string | undefined {
  if (!raw) return undefined
  const t = raw.trim()
  if (!t) return undefined
  return t.length > 150 ? t.slice(0, 150) : t
}

const typeOptions = [
  { value: '', label: 'All Types' },
  ...PROPERTY_TYPES.map((t) => ({ value: t, label: t })),
]

const listingTypeOptions = [
  { value: '', label: 'All Listings' },
  ...LISTING_TYPES.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) })),
]

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...PROPERTY_STATUSES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
]

interface PropertyListingListProps {
  variant: 'admin' | 'public'
}

export function PropertyListingList({ variant }: PropertyListingListProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialType = typeFromSearchParam(searchParams.get('type'))
  const initialListingType = listingTypeFromSearchParam(searchParams.get('listingType'))
  const initialSearch = searchFromSearchParam(searchParams.get('search'))
  const initialStatus =
    variant === 'admin' ? statusFromSearchParam(searchParams.get('status')) : undefined
  const initialQuery: PropertyQueryParams = {
    ...(initialType ? { type: initialType } : {}),
    ...(initialListingType ? { listingType: initialListingType } : {}),
    ...(initialSearch ? { search: initialSearch } : {}),
    ...(initialStatus ? { status: initialStatus } : {}),
  }
  const {
    properties,
    pagination,
    isLoading,
    error,
    setPage,
    setFilters,
    query,
  } = useProperties(initialQuery)

  const [searchInput, setSearchInput] = useState(() => initialSearch ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, PROPERTY_SEARCH_DEBOUNCE_MS)

  const pushUrlForQuery = useCallback(
    (next: PropertyQueryParams) => {
      const forUrl = queryForUrlSync(next, variant)
      setSearchParams(
        propertyQueryToSearchParams(forUrl, { includeStatus: variant === 'admin' }),
        { replace: true },
      )
    },
    [variant, setSearchParams],
  )

  useEffect(() => {
    const trimmedInput = searchInput.trim()
    if (trimmedInput === '') {
      if ((query.search ?? undefined) !== undefined) {
        setFilters({ search: undefined })
        pushUrlForQuery({ ...query, search: undefined })
      }
      return
    }
    const next = debouncedSearch.trim() || undefined
    if (!next || next !== trimmedInput) return
    if (next === (query.search ?? undefined)) return
    setFilters({ search: next })
    pushUrlForQuery({ ...query, search: next })
  }, [searchInput, debouncedSearch, query, setFilters, pushUrlForQuery])

  const handleFilterChange = (key: string, value: string) => {
    const merged = { ...query, [key]: value || undefined }
    if (variant === 'public') {
      const { status: _status, ...rest } = merged
      setFilters(rest)
      pushUrlForQuery(rest)
    } else {
      setFilters(merged)
      pushUrlForQuery(merged)
    }
  }

  const handleSearchClear = () => {
    setSearchInput('')
    setFilters({ search: undefined })
    pushUrlForQuery({ ...query, search: undefined })
  }

  const removeChip = (key: FilterChipKey) => {
    if (key === 'search') setSearchInput('')
    setFilters({ [key]: undefined } as Omit<PropertyQueryParams, 'page' | 'limit'>)
    const merged = { ...query, [key]: undefined }
    if (variant === 'public') {
      const { status: _status, ...rest } = merged
      pushUrlForQuery(rest)
    } else {
      pushUrlForQuery(merged)
    }
  }

  const filterGridClass =
    variant === 'admin' ? 'grid-cols-1 gap-3 sm:grid-cols-3' : 'grid-cols-1 gap-3 sm:grid-cols-2'

  const chips = useMemo(() => buildFilterChips(query, variant), [query, variant])

  const pageRangeLabel =
    pagination.total > 0 && pagination.totalPages > 1
      ? `Page ${pagination.page} of ${pagination.totalPages}`
      : null

  const headingBlock = (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        {variant === 'admin' ? 'All Properties' : 'All Listings'}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {variant === 'admin'
          ? 'Manage, filter, and review all properties in the system.'
          : 'Search and filter the full catalogue of verified Sri Lankan properties.'}
      </p>
    </div>
  )

  const filterPanel = (
    <div className={variant === 'admin' ? 'w-full min-w-0 rounded-2xl border border-slate-200/80 bg-surface p-4 shadow-sm sm:p-5' : 'w-full min-w-0'}>
      <div className="w-full min-w-0">
        <SearchBar
          placeholder="Search by title, location, or keywords…"
          aria-label="Search property listings"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={handleSearchClear}
          isLoading={isLoading}
          maxLength={150}
        />
      </div>

      <div className={`mt-4 grid ${filterGridClass}`}>
        <Select
          label="Property Type"
          options={typeOptions}
          value={query.type ?? ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        />
        <Select
          label="Listing Type"
          options={listingTypeOptions}
          value={query.listingType ?? ''}
          onChange={(e) => handleFilterChange('listingType', e.target.value)}
        />
        {variant === 'admin' && (
          <Select
            label="Status"
            options={statusOptions}
            value={query.status ?? ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          />
        )}
      </div>
    </div>
  )

  const resultsBlock = (
    <div className="flex flex-col gap-4">
      {!isLoading && (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing{' '}
            <span className="font-semibold text-slate-800">{pagination.total.toLocaleString()}</span>{' '}
            {pagination.total === 1 ? 'property' : 'properties'}
          </p>
          {pageRangeLabel && (
            <p className="text-xs font-medium text-slate-500">{pageRangeLabel}</p>
          )}
        </div>
      )}

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Active filters">
          {chips.map((chip) => (
            <FilterChip
              key={chip.key}
              label={chip.label}
              removeAriaLabel={`Remove filter ${chip.label}`}
              onRemove={() => removeChip(chip.key)}
            />
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="h-8 w-8 text-brand" />
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          icon={
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          }
          title="No properties found"
          description={
            variant === 'admin'
              ? 'There are no properties matching your filters. Try adjusting your search or add a new property.'
              : 'There are no properties matching your filters. Try broadening your search or changing filters.'
          }
          action={
            variant === 'admin' ? (
              <Link to={ROUTES.ADMIN_ADD_HOUSE}>
                <Button variant="primary" size="sm">Add Property</Button>
              </Link>
            ) : (
              <BackButton variant="outline" size="sm" label="Back to home" />
            )
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyListingCard key={property._id} property={property} variant={variant} />
            ))}
          </div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )

  if (variant === 'public') {
    return (
      <>
        <section className="bg-white py-8 sm:py-10">
          <SectionContainer className="flex flex-col gap-6">
            {headingBlock}
            {filterPanel}
          </SectionContainer>
        </section>

        <section className="bg-slate-50 py-8 sm:py-10">
          <SectionContainer className="flex flex-col gap-4">
            <AlertBanner message={error} />
            {resultsBlock}
          </SectionContainer>
        </section>
      </>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {headingBlock}
      {filterPanel}
      <AlertBanner message={error} />
      {resultsBlock}
    </div>
  )
}
