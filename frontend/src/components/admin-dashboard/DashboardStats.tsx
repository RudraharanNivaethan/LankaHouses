import { StatCard } from '../ui/StatCard'
import { ROUTES, adminHousesListUrl } from '../../constants/routes'
import { ListingsIcon, InquiriesIcon, UsersIcon } from '../ui/icons'
import type { DashboardStats as DashboardStatsData } from '../../hooks/useDashboardStats'

interface DashboardStatsProps {
  stats: DashboardStatsData
}

const PendingIcon = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const SoldIcon = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const RemovedIcon = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
)

/**
 * Renders the dashboard stat grid. Accepts the full stats object produced by
 * `useDashboardStats`. The user-role row is rendered only when `stats.userStats`
 * is present — the hook includes it exclusively for users whose backend
 * permissions grant `canViewUserRoleStats`, so no per-render role check is
 * needed here.
 */
export function DashboardStats({ stats }: DashboardStatsProps) {
  const { userStats } = stats

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          icon={<ListingsIcon className="h-6 w-6" />}
          value={stats.activeListings}
          label="Active Listings"
          href={adminHousesListUrl('active')}
          iconColor="emerald"
        />
        <StatCard
          icon={SoldIcon}
          value={stats.soldListings}
          label="Sold Listings"
          href={adminHousesListUrl('sold')}
          iconColor="brand"
        />
        <StatCard
          icon={RemovedIcon}
          value={stats.removedListings}
          label="Removed Listings"
          href={adminHousesListUrl('removed')}
          iconColor="rose"
        />
        <StatCard
          icon={<InquiriesIcon className="h-6 w-6" />}
          value={stats.totalInquiries}
          label="Total Inquiries"
          href={ROUTES.ADMIN_INQUIRIES}
          iconColor="blue"
        />
        <StatCard
          icon={PendingIcon}
          value={stats.pendingInquiries}
          label="Pending Inquiries"
          href={ROUTES.ADMIN_INQUIRIES}
          iconColor="amber"
        />
      </div>

      {userStats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard
            icon={<UsersIcon className="h-6 w-6" />}
            value={userStats.totalUsers}
            label="Total Users"
            href={ROUTES.ADMIN_USERS}
            iconColor="blue"
          />
          <StatCard
            icon={<UsersIcon className="h-6 w-6" />}
            value={userStats.totalAdmins}
            label="Total Admins"
            href={`${ROUTES.ADMIN_USERS}?role=admin`}
            iconColor="brand"
          />
          <StatCard
            icon={<UsersIcon className="h-6 w-6" />}
            value={userStats.totalSuperAdmins}
            label="Super Admins"
            href={`${ROUTES.ADMIN_USERS}?role=superadmin`}
            iconColor="emerald"
          />
        </div>
      )}
    </div>
  )
}
