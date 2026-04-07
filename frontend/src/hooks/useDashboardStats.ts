import { useEffect, useState } from 'react'

export interface DashboardStats {
  activeListings: number
  totalInquiries: number
  pendingInquiries: number
}

const MOCK_STATS: DashboardStats = {
  activeListings: 24,
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
        // TODO: Replace with real API call — e.g. const data = await getDashboardStats()
        await new Promise((r) => setTimeout(r, 400))
        if (active) setStats(MOCK_STATS)
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
