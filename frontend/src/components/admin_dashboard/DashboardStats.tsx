import { StatCard } from '../ui/StatCard'
import { ROUTES, adminHousesListUrl } from '../../constants/routes'

interface DashboardStatsProps {
  activeListings: number
  soldListings: number
  removedListings: number
  totalInquiries: number
  pendingInquiries: number
}

const ListingsIcon = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const TotalInquiriesIcon = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
)

const PendingIcon = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const SoldIcon = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const RemovedIcon = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
)

export function DashboardStats({
  activeListings,
  soldListings,
  removedListings,
  totalInquiries,
  pendingInquiries,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        icon={ListingsIcon}
        value={activeListings}
        label="Active Listings"
        href={adminHousesListUrl('active')}
        iconColor="emerald"
      />
      <StatCard
        icon={SoldIcon}
        value={soldListings}
        label="Sold Listings"
        href={adminHousesListUrl('sold')}
        iconColor="brand"
      />
      <StatCard
        icon={RemovedIcon}
        value={removedListings}
        label="Removed Listings"
        href={adminHousesListUrl('removed')}
        iconColor="rose"
      />
      <StatCard
        icon={TotalInquiriesIcon}
        value={totalInquiries}
        label="Total Inquiries"
        href={ROUTES.ADMIN_INQUIRIES}
        iconColor="blue"
      />
      <StatCard
        icon={PendingIcon}
        value={pendingInquiries}
        label="Pending Inquiries"
        href={ROUTES.ADMIN_INQUIRIES}
        iconColor="amber"
      />
    </div>
  )
}
