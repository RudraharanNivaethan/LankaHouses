import { useEffect, useState } from 'react'
import { getAdminListingStats } from '../services/propertyService'
import { getUserStats } from '../services/superAdminService'
import { useAuth } from '../context/AuthContext'
import type { UserRoleStats } from '../types/auth'

export interface DashboardStats {
  activeListings: number
  soldListings: number
  removedListings: number
  totalInquiries: number
  pendingInquiries: number
  userStats?: UserRoleStats
}

/**
 * Loads the admin dashboard stats. Branches on the authenticated user's
 * backend-supplied `canViewUserRoleStats` permission; pages no longer pass
 * a role flag.
 */
export function useDashboardStats() {
  const { user } = useAuth()
  const canViewUserStats = user?.permissions.includes('users.stats.read') ?? false

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function fetchStats() {
      setIsLoading(true)
      setError(null)
      try {
        const requests: [ReturnType<typeof getAdminListingStats>, Promise<UserRoleStats | null>] = [
          getAdminListingStats(),
          canViewUserStats ? getUserStats() : Promise.resolve(null),
        ]
        const [listingRes, userRoleStats] = await Promise.all(requests)
        if (active) {
          setStats({
            activeListings: listingRes.data.activeListings,
            soldListings: listingRes.data.soldListings,
            removedListings: listingRes.data.removedListings,
            // Inquiry stats will be populated from the real inquiries API endpoint in a future sprint.
            totalInquiries: 0,
            pendingInquiries: 0,
            ...(userRoleStats ? { userStats: userRoleStats } : {}),
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
  }, [canViewUserStats])

  return { stats, isLoading, error }
}
