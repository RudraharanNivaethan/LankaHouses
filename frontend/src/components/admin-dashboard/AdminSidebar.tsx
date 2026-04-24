import type { ReactNode } from 'react'
import { SidebarLink } from '../ui/SidebarLink'
import { HousesIcon, InquiriesIcon, UsersIcon } from '../ui/icons'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../context/AuthContext'

const DashboardIcon = (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
  </svg>
)

interface NavItem {
  to: string
  icon: ReactNode
  label: string
  end?: boolean
  /**
   * Optional permission key required to show this link.
   * If present, the link is only rendered when `user.permissions` includes
   * this string. The string values come from the backend (`/api/auth/me`) —
   * never defined or duplicated on the frontend.
   */
  requires?: string
}

/**
 * Nav manifest. Each entry may declare a `requires` permission string; if
 * present, the link is only rendered when the user holds that permission as
 * returned by the backend.
 */
const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.ADMIN_DASHBOARD, icon: DashboardIcon,     label: 'Dashboard',  end: true },
  { to: ROUTES.ADMIN_HOUSES,    icon: <HousesIcon />,    label: 'Houses' },
  { to: ROUTES.ADMIN_INQUIRIES, icon: <InquiriesIcon />, label: 'Inquiries' },
  { to: ROUTES.ADMIN_USERS,     icon: <UsersIcon />,     label: 'Users', requires: 'users.read' },
]

interface AdminSidebarProps {
  pendingInquiries?: number
  collapsed?: boolean
}

export function AdminSidebar({ pendingInquiries, collapsed }: AdminSidebarProps) {
  const { user } = useAuth()
  const permissions = user?.permissions

  return (
    <div className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        if (item.requires && !permissions?.includes(item.requires)) return null
        const badge = item.to === ROUTES.ADMIN_INQUIRIES ? pendingInquiries : undefined
        return (
          <SidebarLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            end={item.end}
            badge={badge}
            collapsed={collapsed}
          />
        )
      })}
    </div>
  )
}
