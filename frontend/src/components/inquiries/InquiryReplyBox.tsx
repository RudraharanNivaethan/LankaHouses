import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { InquiryRecord } from '../../types/inquiry'
import { adminReplySchema, type AdminReplySchema } from '../../schemas/inquiry'
import { replyToInquiry } from '../../services/inquiryService'
import { Textarea } from '../ui/Textarea'
import { AlertBanner } from '../ui/AlertBanner'
import { FormSubmitButton } from '../ui/FormSubmitButton'
import { formatAdminDate } from '../../utils/formatDate'

interface InquiryReplyBoxProps {
  inquiry: InquiryRecord
  onReplied: (updated: InquiryRecord) => void
}

export function InquiryReplyBox({ inquiry, onReplied }: InquiryReplyBoxProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminReplySchema>({
    resolver: zodResolver(adminReplySchema),
  })

  async function onSubmit(data: AdminReplySchema) {
    setServerError(null)

    // Optimistic update — show the reply immediately
    const optimistic: InquiryRecord = {
      ...inquiry,
      status: 'REPLIED',
      adminReply: data.adminReply,
      repliedAt: new Date().toISOString(),
    }
    onReplied(optimistic)

    try {
      const res = await replyToInquiry(inquiry._id, { adminReply: data.adminReply })
      onReplied(res.data) // reconcile with server
      toast.success('Reply sent successfully')
      reset()
    } catch (err) {
      onReplied(inquiry) // rollback
      const msg = err instanceof Error ? err.message : 'Failed to submit reply.'
      setServerError(msg)
    }
  }

  // Read-only view when already replied
  if (inquiry.status === 'REPLIED' && inquiry.adminReply) {
    return (
      <section className="rounded-xl border border-green-200 bg-green-50 p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-green-800">Admin Reply</h3>
          {inquiry.repliedAt && (
            <span className="text-xs text-green-600">{formatAdminDate(inquiry.repliedAt)}</span>
          )}
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-green-900">{inquiry.adminReply}</p>
      </section>
    )
  }

  // Closed — no reply box
  if (inquiry.status === 'CLOSED') {
    return (
      <section className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-sm text-slate-500">This inquiry has been closed. No further replies can be added.</p>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Write a Reply</h3>
      <AlertBanner message={serverError} />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 flex flex-col gap-4" noValidate>
        <Textarea
          label="Reply"
          rows={5}
          placeholder="Write your response to this inquiry…"
          error={errors.adminReply?.message}
          disabled={isSubmitting}
          {...register('adminReply')}
        />
        <div className="flex justify-end">
          <FormSubmitButton
            isLoading={isSubmitting}
            label="Send Reply"
            loadingLabel="Sending…"
            size="md"
            className="justify-center"
          />
        </div>
      </form>
    </section>
  )
}
