import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { PageHeader } from '../../components/layout/PageHeader'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'
import { Button } from '../../components/ui/Button'
import { ROUTES } from '../../constants/routes'

export function AdminHousesPage() {
  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="flex flex-col gap-7">
        <PageHeader
          title="Houses"
          description="Manage your property listings."
          actions={
            <Link to={ROUTES.ADMIN_ADD_HOUSE}>
              <Button variant="primary" size="md">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Property
              </Button>
            </Link>
          }
        />

        <ComingSoon
          title="Property Management"
          description="The house listing table will be built in Sprint 2. You will be able to view, edit, change status, and manage all property listings from here."
        />
      </div>
    </AdminLayout>
  )
}

function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-700">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      <span className="mt-4 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
        Coming in Sprint 2
      </span>
    </div>
  )
}
