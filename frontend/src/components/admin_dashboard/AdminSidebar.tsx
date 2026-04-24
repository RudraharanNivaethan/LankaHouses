import { SidebarLink } from '../ui/SidebarLink'
import { ROUTES } from '../../constants/routes'

const DashboardIcon = (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
  </svg>
)

const HousesIcon = (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const InquiriesIcon = (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
)

const UsersIcon = (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6zm-12 0a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
)

interface AdminSidebarProps {
  pendingInquiries?: number
  isSuperAdmin?: boolean
}

export function AdminSidebar({ pendingInquiries, isSuperAdmin = false }: AdminSidebarProps) {
  return (
    <div className="flex flex-col gap-1">
      <SidebarLink to={ROUTES.ADMIN_DASHBOARD} icon={DashboardIcon} label="Dashboard" end />
      <SidebarLink to={ROUTES.ADMIN_HOUSES} icon={HousesIcon} label="Houses" />
      <SidebarLink to={ROUTES.ADMIN_INQUIRIES} icon={InquiriesIcon} label="Inquiries" badge={pendingInquiries} />
      {isSuperAdmin && (
        <SidebarLink to={ROUTES.ADMIN_USERS} icon={UsersIcon} label="Users" />
      )}
    </div>
  )
}
