import { AdminLayout } from '../../components/layout/AdminLayout'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'
import { DashboardStats } from '../../components/admin_dashboard/DashboardStats'
import { QuickActions } from '../../components/admin_dashboard/QuickActions'
import { WelcomeBanner } from '../../components/admin_dashboard/WelcomeBanner'
import { Spinner } from '../../components/ui/Spinner'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import { useAuth } from '../../context/AuthContext'

export function AdminDashboardPage() {
  const { stats, isLoading, error } = useDashboardStats()
  const { user } = useAuth()

  return (
    <AdminLayout sidebar={<AdminSidebar pendingInquiries={stats?.pendingInquiries} />}>
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
              />
              <QuickActions />
            </>
          )
        )}
      </div>
    </AdminLayout>
  )
}
