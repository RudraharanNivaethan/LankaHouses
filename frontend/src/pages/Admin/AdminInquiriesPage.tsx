import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { InquiryRecord } from '../../types/inquiry'
import type { InquiryFilterValues } from '../../components/inquiries/InquiryFilters'
import { getAdminInquiries } from '../../services/inquiryService'
import { InquiryCard } from '../../components/inquiries/InquiryCard'
import { InquiryFilters } from '../../components/inquiries/InquiryFilters'
import { InquiryListSkeleton } from '../../components/inquiries/InquiryListSkeleton'
import { AdminShell } from '../../components/layout/AdminShell'
import { PageHeader } from '../../components/layout/PageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Pagination } from '../../components/ui/Pagination'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { adminInquiryDetailPath } from '../../constants/routes'

const InquiriesIcon = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
)

export function AdminInquiriesPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<InquiryFilterValues>({})
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-inquiries', filters, page],
    queryFn: () => getAdminInquiries({ ...filters, page }),
  })

  const inquiries: InquiryRecord[] = data?.data ?? []
  const total = data?.pagination.total ?? 0
  const totalPages = data?.pagination.totalPages ?? 1

  function handleFiltersChange(next: InquiryFilterValues) {
    setFilters(next)
    setPage(1)
  }

  return (
    <AdminShell
      header={
        <PageHeader
          title="Inquiries"
          eyebrow="Inbox"
          description={total > 0 ? `${total} inquiry${total !== 1 ? 's' : ''}` : 'Review and respond to buyer inquiries.'}
        />
      }
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Filter sidebar */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Filters</p>
            <InquiryFilters
              filters={filters}
              onChange={handleFiltersChange}
              vertical
              showSearch
            />
          </div>
        </aside>

        {/* Inquiry list */}
        <section className="min-w-0 flex-1">
          <AlertBanner message={error instanceof Error ? error.message : null} />

          {isLoading ? (
            <InquiryListSkeleton count={6} />
          ) : inquiries.length === 0 ? (
            <EmptyState
              icon={InquiriesIcon}
              title="No inquiries found"
              description="There are no inquiries matching the current filters."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {inquiries.map((inq) => (
                <InquiryCard
                  key={inq._id}
                  inquiry={inq}
                  onClick={(i) => navigate(adminInquiryDetailPath(i._id))}
                />
              ))}
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  )
}
