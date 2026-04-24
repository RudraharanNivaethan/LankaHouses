import { AdminShell } from '../../components/layout/AdminShell'
import { DashboardStats } from '../../components/admin-dashboard/DashboardStats'
import { QuickActions } from '../../components/admin-dashboard/QuickActions'
import { WelcomeBanner } from '../../components/admin-dashboard/WelcomeBanner'
import { Spinner } from '../../components/ui/Spinner'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import { useAuth } from '../../context/AuthContext'

export function AdminDashboardPage() {
  const { user } = useAuth()
  const { stats, isLoading, error } = useDashboardStats()

  return (
    <AdminShell
      header={user ? <WelcomeBanner name={user.name} /> : null}
      pendingInquiries={stats?.pendingInquiries}
    >
      <AlertBanner message={error} />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="h-8 w-8 text-brand" />
        </div>
      ) : (
        stats && (
          <>
            <DashboardStats stats={stats} />
            <QuickActions />
          </>
        )
      )}
    </AdminShell>
  )
}
