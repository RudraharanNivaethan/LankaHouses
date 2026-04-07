import { AdminLayout } from '../../components/layout/AdminLayout'
import { PageHeader } from '../../components/layout/PageHeader'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'

export function AdminInquiriesPage() {
  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="flex flex-col gap-7">
        <PageHeader
          title="Inquiries"
          description="Review and respond to buyer inquiries."
        />

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-700">Inquiry Management</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            The inquiries table with status filtering (Pending / Contacted / Closed) will be built in Sprint 2.
          </p>
          <span className="mt-4 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
            Coming in Sprint 2
          </span>
        </div>
      </div>
    </AdminLayout>
  )
}
