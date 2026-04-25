import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { InquiryRecord } from '../../types/inquiry'
import type { PropertyRecord } from '../../types/property'
import { getMyInquiryById } from '../../services/inquiryService'
import { getPropertyById } from '../../services/propertyService'
import { InquiryStatusBadge } from '../../components/inquiries/InquiryStatusBadge'
import { PropertyPreviewCard } from '../../components/inquiries/PropertyPreviewCard'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Spinner } from '../../components/ui/Spinner'
import { BackButton } from '../../components/ui/BackButton'
import { DetailField } from '../../components/ui/DetailField'
import { formatAdminDate } from '../../utils/formatDate'

export function InquiryDetailsPage() {
  const { inquiryId } = useParams<{ inquiryId: string }>()
  const [inquiry, setInquiry] = useState<InquiryRecord | null>(null)
  const [property, setProperty] = useState<PropertyRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!inquiryId) return
    setIsLoading(true)
    getMyInquiryById(inquiryId)
      .then(async (res) => {
        setInquiry(res.data)
        if (res.data.propertyId) {
          const prop = await getPropertyById(res.data.propertyId).catch(() => null)
          setProperty(prop?.data ?? null)
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load inquiry.'))
      .finally(() => setIsLoading(false))
  }, [inquiryId])

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="h-6 w-6 text-brand" />
      </div>
    )
  }

  if (error || !inquiry) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <BackButton className="mb-4" />
        <AlertBanner message={error ?? 'Inquiry not found.'} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <BackButton className="mb-4" />

      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-800">{inquiry.title}</h1>
        <InquiryStatusBadge status={inquiry.status} />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        <DetailField label="Type"    value={inquiry.inquiryType === 'GENERAL' ? 'General' : 'Property'} />
        <DetailField label="Created" value={formatAdminDate(inquiry.createdAt)} />
        <DetailField label="Updated" value={formatAdminDate(inquiry.updatedAt)} />
      </dl>

      {inquiry.inquiryType === 'PROPERTY' && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Property</p>
          <PropertyPreviewCard property={property} isLoading={false} />
        </div>
      )}

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Your Message</h2>
        <p className="whitespace-pre-wrap text-sm text-slate-800">{inquiry.message}</p>
      </section>

      {inquiry.adminReply && (
        <section className="mt-4 rounded-xl border border-green-200 bg-green-50 p-5">
          <h2 className="text-sm font-semibold text-green-800">Admin Reply</h2>
          {inquiry.repliedAt && (
            <p className="mt-0.5 text-xs text-green-600">{formatAdminDate(inquiry.repliedAt)}</p>
          )}
          <p className="mt-3 whitespace-pre-wrap text-sm text-green-900">{inquiry.adminReply}</p>
        </section>
      )}
    </div>
  )
}
