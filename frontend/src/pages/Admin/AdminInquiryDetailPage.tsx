import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { InquiryRecord } from '../../types/inquiry'
import type { PropertyRecord } from '../../types/property'
import { getAdminInquiryById, closeInquiry } from '../../services/inquiryService'
import { getPropertyById } from '../../services/propertyService'
import { InquiryStatusBadge } from '../../components/inquiries/InquiryStatusBadge'
import { InquiryReplyBox } from '../../components/inquiries/InquiryReplyBox'
import { PropertyPreviewCard } from '../../components/inquiries/PropertyPreviewCard'
import { AdminShell } from '../../components/layout/AdminShell'
import { PageHeader } from '../../components/layout/PageHeader'
import { BackButton } from '../../components/ui/BackButton'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Spinner } from '../../components/ui/Spinner'
import { Button } from '../../components/ui/Button'
import { DetailField } from '../../components/ui/DetailField'
import { formatAdminDate } from '../../utils/formatDate'

export function AdminInquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [inquiry, setInquiry] = useState<InquiryRecord | null>(null)
  const [property, setProperty] = useState<PropertyRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [closeError, setCloseError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    getAdminInquiryById(id)
      .then(async (res) => {
        setInquiry(res.data)
        if (res.data.propertyId) {
          const prop = await getPropertyById(res.data.propertyId).catch(() => null)
          setProperty(prop?.data ?? null)
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load inquiry.'))
      .finally(() => setIsLoading(false))
  }, [id])

  async function handleClose() {
    if (!inquiry) return
    setIsClosing(true)
    setCloseError(null)
    try {
      const res = await closeInquiry(inquiry._id)
      setInquiry(res.data)
    } catch (err) {
      setCloseError(err instanceof Error ? err.message : 'Failed to close inquiry.')
    } finally {
      setIsClosing(false)
    }
  }

  return (
    <AdminShell
      header={
        <div>
          <BackButton className="mb-3" />
          <PageHeader
            title="Inquiry Detail"
            description={inquiry ? inquiry.title : 'Loading…'}
          />
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-6 w-6 text-brand" />
        </div>
      ) : error || !inquiry ? (
        <AlertBanner message={error ?? 'Inquiry not found.'} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <InquiryStatusBadge status={inquiry.status} />
            {inquiry.status !== 'CLOSED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                disabled={isClosing}
              >
                {isClosing ? 'Closing…' : 'Close Inquiry'}
              </Button>
            )}
          </div>

          <AlertBanner message={closeError} />

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            <DetailField label="Type"    value={inquiry.inquiryType === 'GENERAL' ? 'General' : 'Property'} />
            <DetailField label="Created" value={formatAdminDate(inquiry.createdAt)} />
            <DetailField label="Updated" value={formatAdminDate(inquiry.updatedAt)} />
          </dl>

          {inquiry.inquiryType === 'PROPERTY' && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Linked Property</p>
              <PropertyPreviewCard property={property} isLoading={false} />
            </div>
          )}

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-2 text-sm font-semibold text-slate-700">Inquiry Message</h2>
            <p className="whitespace-pre-wrap text-sm text-slate-800">{inquiry.message}</p>
          </section>

          <InquiryReplyBox inquiry={inquiry} onReplied={setInquiry} />
        </div>
      )}
    </AdminShell>
  )
}
