import { AdminLayout } from '../../components/layout/AdminLayout'
import { PageHeader } from '../../components/layout/PageHeader'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'
import { DashboardStats } from '../../components/admin_dashboard/DashboardStats'
import { QuickActions } from '../../components/admin_dashboard/QuickActions'
import { Spinner } from '../../components/ui/Spinner'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { useDashboardStats } from '../../hooks/useDashboardStats'

export function AdminDashboardPage() {
  const { stats, isLoading, error } = useDashboardStats()

  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Dashboard"
          description="Overview of your property listings and inquiries."
        />

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
