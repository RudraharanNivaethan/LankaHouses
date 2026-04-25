import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { InquiryRecord } from '../../types/inquiry'
import type { InquiryFilterValues } from '../../components/inquiries/InquiryFilters'
import { getMyInquiries } from '../../services/inquiryService'
import { InquiryCard } from '../../components/inquiries/InquiryCard'
import { InquiryFilters } from '../../components/inquiries/InquiryFilters'
import { InquiryListSkeleton } from '../../components/inquiries/InquiryListSkeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Pagination } from '../../components/ui/Pagination'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { ROUTES, inquiryDetailPath } from '../../constants/routes'

const InboxIcon = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
  </svg>
)

export function MyInquiriesPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<InquiryFilterValues>({})
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-inquiries', filters, page],
    queryFn: () => getMyInquiries({ ...filters, page }),
  })

  const inquiries: InquiryRecord[] = data?.data ?? []
  const total = data?.pagination.total ?? 0
  const totalPages = data?.pagination.totalPages ?? 1

  function handleFiltersChange(next: InquiryFilterValues) {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Inquiries</h1>
            <p className="mt-1 text-sm text-slate-500">
              {total > 0 ? `${total} inquiry${total !== 1 ? 's' : ''}` : 'All your submitted inquiries'}
            </p>
          </div>
          <Link
            to={ROUTES.CREATE_GENERAL_INQUIRY}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Inquiry
          </Link>
        </div>

        {/* 2-col layout */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Filter sidebar */}
          <aside className="w-full shrink-0 lg:w-56">
            <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Filters</p>
              <InquiryFilters filters={filters} onChange={handleFiltersChange} vertical />
            </div>
          </aside>

          {/* Main list */}
          <section className="min-w-0 flex-1">
            <AlertBanner message={error instanceof Error ? error.message : null} />

            {isLoading ? (
              <InquiryListSkeleton count={5} />
            ) : inquiries.length === 0 ? (
              <EmptyState
                icon={InboxIcon}
                title="No inquiries found"
                description="You haven't submitted any inquiries yet, or none match the current filters."
                action={
                  <Link
                    to={ROUTES.CREATE_GENERAL_INQUIRY}
                    className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
                  >
                    Submit your first inquiry
                  </Link>
                }
              />
            ) : (
              <div className="flex flex-col gap-3">
                {inquiries.map((inq) => (
                  <InquiryCard
                    key={inq._id}
                    inquiry={inq}
                    onClick={(i) => navigate(inquiryDetailPath(i._id))}
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
      </div>
    </div>
  )
}
