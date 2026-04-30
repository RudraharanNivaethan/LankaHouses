import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getMyInquiryById } from '../../services/inquiryService'
import { getPropertyById } from '../../services/propertyService'
import { InquiryStatusBadge } from '../../components/inquiries/InquiryStatusBadge'
import { PropertyPreviewCard } from '../../components/inquiries/PropertyPreviewCard'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Skeleton } from '../../components/ui/Skeleton'
import { BackButton } from '../../components/ui/BackButton'
import { formatAdminDate } from '../../utils/formatDate'
import { ROUTES, listingDetailPath } from '../../constants/routes'

function DetailSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>
  )
}

export function InquiryDetailsPage() {
  const { inquiryId } = useParams<{ inquiryId: string }>()

  const { data: inquiryRes, isLoading, error } = useQuery({
    queryKey: ['my-inquiry', inquiryId],
    queryFn: () => getMyInquiryById(inquiryId!),
    enabled: !!inquiryId,
  })

  const inquiry = inquiryRes?.data

  const { data: propertyRes, isLoading: propertyLoading } = useQuery({
    queryKey: ['property', inquiry?.propertyId],
    queryFn: () => getPropertyById(inquiry!.propertyId!),
    enabled: !!inquiry?.propertyId,
  })

  const property = propertyRes?.data ?? null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <BackButton className="mb-6" />
          <DetailSkeleton />
        </div>
      </div>
    )
  }

  if (error || !inquiry) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <BackButton className="mb-6" />
          <AlertBanner message={error instanceof Error ? error.message : 'Inquiry not found.'} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <BackButton className="mb-6" />

        {/* Title row */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{inquiry.title}</h1>
          <InquiryStatusBadge status={inquiry.status} />
        </div>

        {/* Metadata row */}
        <div className="mb-6 flex flex-wrap gap-5 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-500">Type</p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">
              {inquiry.inquiryType === 'GENERAL' ? 'General Inquiry' : 'Property Inquiry'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Submitted</p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">{formatAdminDate(inquiry.createdAt)}</p>
          </div>
          {inquiry.updatedAt !== inquiry.createdAt && (
            <div>
              <p className="text-xs font-semibold text-slate-500">Last Updated</p>
              <p className="mt-0.5 text-sm font-medium text-slate-800">{formatAdminDate(inquiry.updatedAt)}</p>
            </div>
          )}
        </div>

        {/* Property card */}
        {inquiry.inquiryType === 'PROPERTY' && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Property</p>
            <PropertyPreviewCard
            property={property}
            isLoading={propertyLoading}
            linkTo={property ? listingDetailPath(property._id) : undefined}
          />
          </div>
        )}

        {/* User message */}
        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Your Message</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{inquiry.message}</p>
        </section>

        {/* Admin reply */}
        {inquiry.adminReply ? (
          <section className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-green-800">Admin Reply</h2>
              {inquiry.repliedAt && (
                <span className="text-xs text-green-600">{formatAdminDate(inquiry.repliedAt)}</span>
              )}
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-green-900">{inquiry.adminReply}</p>
          </section>
        ) : inquiry.status === 'PENDING' ? (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm text-yellow-700">
            Your inquiry is pending review. We'll reply as soon as possible.
          </div>
        ) : null}

        {/* Back to list */}
        <div className="mt-8">
          <Link
            to={ROUTES.MY_INQUIRIES}
            className="text-sm font-medium text-brand hover:text-brand-dark"
          >
            ← Back to My Inquiries
          </Link>
        </div>
      </div>
    </div>
  )
}
