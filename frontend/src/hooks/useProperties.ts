import { useState, useEffect, useCallback } from 'react'
import { getProperties } from '../services/propertyService'
import type { PropertyRecord, PaginationInfo, PropertyQueryParams } from '../types/property'
import { DEFAULT_PAGE_LIMIT } from '../constants/property'

export function useProperties(initialQuery: PropertyQueryParams = {}) {
  const [properties, setProperties] = useState<PropertyRecord[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: DEFAULT_PAGE_LIMIT,
    totalPages: 0,
  })
  const [query, setQuery] = useState<PropertyQueryParams>({
    page: 1,
    limit: DEFAULT_PAGE_LIMIT,
    ...initialQuery,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = useCallback(async (params: PropertyQueryParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getProperties(params)
      setProperties(result.data)
      setPagination(result.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties.')
      setProperties([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties(query)
  }, [query, fetchProperties])

  const setPage = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }))
  }, [])

  const setFilters = useCallback((filters: Omit<PropertyQueryParams, 'page' | 'limit'>) => {
    setQuery((prev) => ({ ...prev, ...filters, page: 1 }))
  }, [])

  const refetch = useCallback(() => {
    fetchProperties(query)
  }, [query, fetchProperties])

  return {
    properties,
    pagination,
    isLoading,
    error,
    query,
    setPage,
    setFilters,
    refetch,
  }
}
