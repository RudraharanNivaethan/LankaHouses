import { useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { PageHeader } from '../../components/layout/PageHeader'
import { AdminSidebar } from '../../components/admin_dashboard/AdminSidebar'

export function AdminEditHousePage() {
  const { id } = useParams<{ id: string }>()

  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="flex flex-col gap-7">
        <PageHeader
          title="Edit Property"
          description={id ? `Editing listing ID: ${id}` : 'Edit an existing listing.'}
        />

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-700">Edit Property Form</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            The pre-filled edit form will be built in Sprint 2. Changes to any field will be persisted on submit.
          </p>
          <span className="mt-4 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
            Coming in Sprint 2
          </span>
        </div>
      </div>
    </AdminLayout>
  )
}
