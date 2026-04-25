import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  const isLocked = inquiry.status === 'REPLIED' || inquiry.status === 'CLOSED'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminReplySchema>({
    resolver: zodResolver(adminReplySchema),
  })

  async function onSubmit(data: AdminReplySchema) {
    setServerError(null)
    try {
      const res = await replyToInquiry(inquiry._id, { adminReply: data.adminReply })
      onReplied(res.data)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to submit reply.')
    }
  }

  if (inquiry.status === 'REPLIED' && inquiry.adminReply) {
    return (
      <section className="rounded-xl border border-green-200 bg-green-50 p-5">
        <h3 className="text-sm font-semibold text-green-800">Admin Reply</h3>
        {inquiry.repliedAt && (
          <p className="mt-0.5 text-xs text-green-600">{formatAdminDate(inquiry.repliedAt)}</p>
        )}
        <p className="mt-3 whitespace-pre-wrap text-sm text-green-900">{inquiry.adminReply}</p>
      </section>
    )
  }

  if (inquiry.status === 'CLOSED') {
    return (
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
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
          disabled={isLocked || isSubmitting}
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
