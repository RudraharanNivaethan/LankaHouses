import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { InquiryRecord } from '../../types/inquiry'
import type { InquiryFilterValues } from '../../components/inquiries/InquiryFilters'
import { getMyInquiries } from '../../services/inquiryService'
import { InquiryCard } from '../../components/inquiries/InquiryCard'
import { InquiryFilters } from '../../components/inquiries/InquiryFilters'
import { EmptyState } from '../../components/ui/EmptyState'
import { Pagination } from '../../components/ui/Pagination'
import { Spinner } from '../../components/ui/Spinner'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { ROUTES, inquiryDetailPath } from '../../constants/routes'

const InboxIcon = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
  </svg>
)

export function MyInquiriesPage() {
  const navigate = useNavigate()
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<InquiryFilterValues>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getMyInquiries({ ...filters, page })
      setInquiries(res.data)
      setTotal(res.pagination.total)
      setTotalPages(res.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inquiries.')
    } finally {
      setIsLoading(false)
    }
  }, [filters, page])

  useEffect(() => { fetchInquiries() }, [fetchInquiries])

  function handleFiltersChange(next: InquiryFilterValues) {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Inquiries</h1>
          <p className="mt-1 text-sm text-slate-500">
            {total > 0 ? `${total} inquiry${total !== 1 ? 's' : ''}` : 'No inquiries yet'}
          </p>
        </div>
        <a
          href={ROUTES.CREATE_GENERAL_INQUIRY}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          New Inquiry
        </a>
      </div>

      <div className="mb-5">
        <InquiryFilters filters={filters} onChange={handleFiltersChange} />
      </div>

      <AlertBanner message={error} />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-6 w-6 text-brand" />
        </div>
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={InboxIcon}
          title="No inquiries found"
          description="You haven't submitted any inquiries yet, or none match the current filters."
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
    </div>
  )
}
