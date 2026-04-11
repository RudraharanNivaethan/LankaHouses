import { useState, useEffect, useCallback } from 'react'
import { getPropertyById } from '../services/propertyService'
import type { PropertyRecord } from '../types/property'

export function useProperty(id: string | undefined) {
  const [property, setProperty] = useState<PropertyRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperty = useCallback(async (propertyId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getPropertyById(propertyId)
      setProperty(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property.')
      setProperty(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      setError('Property ID is missing.')
      return
    }
    fetchProperty(id)
  }, [id, fetchProperty])

  const refetch = useCallback(() => {
    if (id) fetchProperty(id)
  }, [id, fetchProperty])

  return { property, isLoading, error, refetch }
}
