import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createInquirySchema, type CreateInquirySchema } from '../../schemas/inquiry'
import { createGeneralInquiry } from '../../services/inquiryService'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { FormSubmitButton } from '../../components/ui/FormSubmitButton'
import { ROUTES } from '../../constants/routes'

export function CreateGeneralInquiryPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInquirySchema>({
    resolver: zodResolver(createInquirySchema),
  })

  const mutation = useMutation({
    mutationFn: createGeneralInquiry,
    onSuccess: () => {
      toast.success('Inquiry submitted successfully')
      navigate(ROUTES.MY_INQUIRIES)
    },
    onError: (err: Error) => {
      setServerError(err.message ?? 'Failed to submit inquiry.')
    },
  })

  function onSubmit(data: CreateInquirySchema) {
    setServerError(null)
    mutation.mutate(data)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <Link
          to={ROUTES.MY_INQUIRIES}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          My Inquiries
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">New Inquiry</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">General Inquiry</h1>
            <p className="mt-1 text-sm text-slate-500">
              Have a question not related to a specific property? Send us a message.
            </p>
          </div>

          <AlertBanner message={serverError} />

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-5" noValidate>
            <Input
              label="Title"
              placeholder="Brief summary of your question"
              error={errors.title?.message}
              disabled={mutation.isPending}
              {...register('title')}
            />
            <Textarea
              label="Message"
              rows={7}
              placeholder="Describe your inquiry in detail…"
              error={errors.message?.message}
              disabled={mutation.isPending}
              {...register('message')}
            />
            <FormSubmitButton
              isLoading={mutation.isPending}
              label="Submit Inquiry"
              loadingLabel="Submitting…"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
