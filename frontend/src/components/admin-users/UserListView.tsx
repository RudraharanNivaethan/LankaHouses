import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUsers } from '../../hooks/useUsers'
import { normalizeSearchInput } from '../../hooks/useDebouncedSearch'
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions'
import { fetchUserSuggestions } from '../../services/superAdminService'
import { isUserRole } from '../../constants/roles'
import { SearchAutocomplete } from '../ui/SearchAutocomplete'
import { FilterChip } from '../ui/FilterChip'
import { AlertBanner } from '../ui/AlertBanner'
import { Pagination } from '../ui/Pagination'
import { UserRoleFilter } from './UserRoleFilter'
import { UserTable } from './UserTable'
import type { UserRole } from '../../types/auth'

function searchFromParam(raw: string | null): string {
  return normalizeSearchInput(raw ?? '')
}

export function UserListView() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialRole = isUserRole(searchParams.get('role'))
    ? (searchParams.get('role') as UserRole)
    : undefined
  const initialSearch = searchFromParam(searchParams.get('search'))

  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(initialRole)
  const [searchInput, setSearchInput] = useState(initialSearch)
  const [activeSearch, setActiveSearch] = useState<string | undefined>(initialSearch || undefined)

  const { users, pagination, page, setPage, isLoading, error } = useUsers({
    role: roleFilter,
    search: activeSearch,
  })

  const { suggestions, isLoadingSuggestions, clearSuggestions } = useSearchSuggestions({
    query: searchInput,
    fetcher: fetchUserSuggestions,
  })

  const syncUrl = useCallback(
    (role: UserRole | undefined, search: string | undefined) => {
      const params: Record<string, string> = {}
      if (role) params.role = role
      if (search) params.search = search
      setSearchParams(params, { replace: true })
    },
    [setSearchParams],
  )

  const handleSearchSubmit = (value: string) => {
    const next = normalizeSearchInput(value) || undefined
    setSearchInput(value)
    clearSuggestions()
    if (next === activeSearch) return
    setActiveSearch(next)
    setPage(1)
    syncUrl(roleFilter, next)
  }

  const handleRoleChange = (role: UserRole | undefined) => {
    setRoleFilter(role)
    setPage(1)
    syncUrl(role, activeSearch)
  }

  const handleSearchClear = () => {
    setSearchInput('')
    clearSuggestions()
    setActiveSearch(undefined)
    setPage(1)
    syncUrl(roleFilter, undefined)
  }

  const removeSearchChip = () => {
    setSearchInput('')
    clearSuggestions()
    setActiveSearch(undefined)
    setPage(1)
    syncUrl(roleFilter, undefined)
  }

  const pageRangeLabel =
    pagination && pagination.total > 0 && pagination.totalPages > 1
      ? `Page ${pagination.page} of ${pagination.totalPages}`
      : null

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full min-w-0 rounded-2xl border border-slate-200/80 bg-surface p-4 shadow-sm sm:p-5">
        <SearchAutocomplete
          placeholder="Search by name or email…"
          aria-label="Search users"
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={handleSearchSubmit}
          onClear={handleSearchClear}
          suggestions={suggestions}
          isLoadingSuggestions={isLoadingSuggestions}
          isLoading={isLoading}
          maxLength={150}
        />
        <div className="mt-4">
          <UserRoleFilter active={roleFilter} onChange={handleRoleChange} />
        </div>
      </div>

      <AlertBanner message={error} />

      <div className="flex flex-col gap-4">
        {!isLoading && pagination && (
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing{' '}
              <span className="font-semibold text-slate-800">
                {pagination.total.toLocaleString()}
              </span>{' '}
              {pagination.total === 1 ? 'user' : 'users'}
            </p>
            {pageRangeLabel && (
              <p className="text-xs font-medium text-slate-500">{pageRangeLabel}</p>
            )}
          </div>
        )}

        {activeSearch && (
          <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Active filters">
            <FilterChip
              label={`Search: ${activeSearch}`}
              removeAriaLabel="Remove search filter"
              onRemove={removeSearchChip}
            />
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <UserTable users={users} isLoading={isLoading} />
        </div>

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  )
}
