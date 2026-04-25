import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { InquiryRecord } from '../../types/inquiry'
import { getAdminInquiryById, closeInquiry } from '../../services/inquiryService'
import { getPropertyById } from '../../services/propertyService'
import { InquiryStatusBadge } from '../../components/inquiries/InquiryStatusBadge'
import { InquiryReplyBox } from '../../components/inquiries/InquiryReplyBox'
import { PropertyPreviewCard } from '../../components/inquiries/PropertyPreviewCard'
import { AdminShell } from '../../components/layout/AdminShell'
import { PageHeader } from '../../components/layout/PageHeader'
import { BackButton } from '../../components/ui/BackButton'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { Skeleton } from '../../components/ui/Skeleton'
import { Button } from '../../components/ui/Button'
import { formatAdminDate } from '../../utils/formatDate'

function DetailSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-40 rounded-xl" />
    </div>
  )
}

export function AdminInquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [localInquiry, setLocalInquiry] = useState<InquiryRecord | null>(null)

  const { data: inquiryRes, isLoading, error } = useQuery({
    queryKey: ['admin-inquiry', id],
    queryFn: () => getAdminInquiryById(id!),
    enabled: !!id,
  })

  // Use local override (for optimistic reply) or fall back to server data
  const inquiry: InquiryRecord | null = localInquiry ?? inquiryRes?.data ?? null

  const { data: propertyRes, isLoading: propertyLoading } = useQuery({
    queryKey: ['property', inquiry?.propertyId],
    queryFn: () => getPropertyById(inquiry!.propertyId!),
    enabled: !!inquiry?.propertyId,
  })

  const property = propertyRes?.data ?? null

  const closeMutation = useMutation({
    mutationFn: () => closeInquiry(inquiry!._id),
    onSuccess: (res) => {
      setLocalInquiry(res.data)
      toast.success('Inquiry closed')
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to close inquiry.')
    },
  })

  function handleReplied(updated: InquiryRecord) {
    setLocalInquiry(updated)
    queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] })
  }

  return (
    <AdminShell
      header={
        <div>
          <BackButton className="mb-3" />
          <PageHeader
            title="Inquiry Detail"
            eyebrow="Admin"
            description={inquiry ? inquiry.title : undefined}
          />
        </div>
      }
    >
      {isLoading ? (
        <DetailSkeleton />
      ) : error || !inquiry ? (
        <AlertBanner message={error instanceof Error ? error.message : 'Inquiry not found.'} />
      ) : (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          {/* Main content column */}
          <div className="min-w-0 flex-1 space-y-5">
            {/* Status + close button row */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <InquiryStatusBadge status={inquiry.status} />
                <span className="text-xs text-slate-400">
                  {inquiry.inquiryType === 'GENERAL' ? 'General Inquiry' : 'Property Inquiry'}
                </span>
              </div>
              {inquiry.status !== 'CLOSED' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => closeMutation.mutate()}
                  disabled={closeMutation.isPending}
                  className="border-slate-300 text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                >
                  {closeMutation.isPending ? 'Closing…' : 'Close Inquiry'}
                </Button>
              )}
            </div>

            {/* User / metadata card */}
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Inquiry Info</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-medium text-slate-500">User ID</dt>
                  <dd className="mt-0.5 truncate font-mono text-xs text-slate-700">{inquiry.userId}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Submitted</dt>
                  <dd className="mt-0.5 text-sm text-slate-700">{formatAdminDate(inquiry.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Last Updated</dt>
                  <dd className="mt-0.5 text-sm text-slate-700">{formatAdminDate(inquiry.updatedAt)}</dd>
                </div>
              </dl>
            </div>

            {/* Property card */}
            {inquiry.inquiryType === 'PROPERTY' && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Linked Property</p>
                <PropertyPreviewCard property={property} isLoading={propertyLoading} />
              </div>
            )}

            {/* User message */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Message from User</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{inquiry.message}</p>
            </section>

            {/* Reply box */}
            <InquiryReplyBox inquiry={inquiry} onReplied={handleReplied} />
          </div>
        </div>
      )}
    </AdminShell>
  )
}
