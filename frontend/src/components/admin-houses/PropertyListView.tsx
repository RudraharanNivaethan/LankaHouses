import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProperties } from '../../hooks/useProperties'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { PropertyListCard } from './PropertyListCard'
import { Pagination } from '../ui/Pagination'
import { EmptyState } from '../ui/EmptyState'
import { Spinner } from '../ui/Spinner'
import { AlertBanner } from '../ui/AlertBanner'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { SearchBar } from '../ui/SearchBar'
import { PROPERTY_TYPES, LISTING_TYPES, PROPERTY_STATUSES } from '../../constants/property'
import { PROPERTY_SEARCH_DEBOUNCE_MS } from '../../constants/propertySearch'
import { ROUTES } from '../../constants/routes'
import type { PropertyStatus } from '../../types/property'

function statusFromSearchParam(raw: string | null): PropertyStatus | undefined {
  if (!raw) return undefined
  return (PROPERTY_STATUSES as readonly string[]).includes(raw) ? (raw as PropertyStatus) : undefined
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

export function PropertyListView() {
  const [searchParams] = useSearchParams()
  const initialStatus = statusFromSearchParam(searchParams.get('status'))
  const {
    properties,
    pagination,
    isLoading,
    error,
    setPage,
    setFilters,
    query,
  } = useProperties(initialStatus ? { status: initialStatus } : {})

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, PROPERTY_SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    const trimmedInput = searchInput.trim()
    if (trimmedInput === '') {
      if ((query.search ?? undefined) !== undefined) {
        setFilters({ search: undefined })
      }
      return
    }
    const next = debouncedSearch.trim() || undefined
    if (!next || next !== trimmedInput) return
    if (next === (query.search ?? undefined)) return
    setFilters({ search: next })
  }, [searchInput, debouncedSearch, query.search, setFilters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...query, [key]: value || undefined })
  }

  const handleSearchClear = () => {
    setSearchInput('')
    setFilters({ search: undefined })
  }

  return (
    <div className="flex flex-col gap-6">
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
        <Select
          label="Status"
          options={statusOptions}
          value={query.status ?? ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        />
      </div>

      <AlertBanner message={error} />

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
          description="There are no properties matching your filters. Try adjusting your search or add a new property."
          action={
            <Link to={ROUTES.ADMIN_ADD_HOUSE}>
              <Button variant="primary" size="sm">Add Property</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyListCard key={property._id} property={property} />
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
}
