import { AdminLayout } from '../../components/layout/AdminLayout'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'
import { DashboardStats } from '../../components/admin_dashboard/DashboardStats'
import { QuickActions } from '../../components/admin_dashboard/QuickActions'
import { WelcomeBanner } from '../../components/admin_dashboard/WelcomeBanner'
import { Spinner } from '../../components/ui/Spinner'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import { useAuth } from '../../context/AuthContext'
import { roleSatisfies } from '../../utils/roleUtils'

export function AdminDashboardPage() {
  const { user } = useAuth()
  const isSuperAdmin = roleSatisfies(user?.role, ['superadmin'])
  const { stats, isLoading, error } = useDashboardStats(isSuperAdmin)

  return (
    <AdminLayout sidebar={<AdminSidebar pendingInquiries={stats?.pendingInquiries} isSuperAdmin={isSuperAdmin} />}>
      <div className="flex flex-col gap-7">
        {user && <WelcomeBanner name={user.name} />}

        <AlertBanner message={error} />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="h-8 w-8 text-brand" />
          </div>
        ) : (
          stats && (
            <>
              <DashboardStats
                activeListings={stats.activeListings}
                soldListings={stats.soldListings}
                removedListings={stats.removedListings}
                totalInquiries={stats.totalInquiries}
                pendingInquiries={stats.pendingInquiries}
                totalUsers={stats.userStats?.totalUsers}
                totalAdmins={stats.userStats?.totalAdmins}
                totalSuperAdmins={stats.userStats?.totalSuperAdmins}
              />
              <QuickActions showCreateAdmin={isSuperAdmin} />
            </>
          )
        )}
      </div>
    </AdminLayout>
  )
}
