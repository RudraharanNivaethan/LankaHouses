import { useEffect, useState } from 'react'
import { getAdminListingStats } from '../services/propertyService'

export interface DashboardStats {
  activeListings: number
  soldListings: number
  removedListings: number
  totalInquiries: number
  pendingInquiries: number
}

const MOCK_INQUIRY_STATS = {
  totalInquiries: 68,
  pendingInquiries: 12,
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function fetchStats() {
      setIsLoading(true)
      setError(null)
      try {
        const { data } = await getAdminListingStats()
        if (active) {
          setStats({
            activeListings: data.activeListings,
            soldListings: data.soldListings,
            removedListings: data.removedListings,
            ...MOCK_INQUIRY_STATS,
          })
        }
      } catch {
        if (active) setError('Failed to load dashboard stats.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    fetchStats()
    return () => { active = false }
  }, [])

  return { stats, isLoading, error }
}
