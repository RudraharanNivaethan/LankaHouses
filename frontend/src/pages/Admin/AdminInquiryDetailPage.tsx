import { useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { PageHeader } from '../../components/layout/PageHeader'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'

export function AdminInquiryDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="flex flex-col gap-7">
        <PageHeader
          title="Inquiry Detail"
          description={id ? `Viewing inquiry ID: ${id}` : 'Full inquiry view with reply form.'}
        />

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-700">Inquiry Detail View</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            The full inquiry detail with buyer information, property reference, and reply form will be built in Sprint 2.
          </p>
          <span className="mt-4 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
            Coming in Sprint 2
          </span>
        </div>
      </div>
    </AdminLayout>
  )
}
