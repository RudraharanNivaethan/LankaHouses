import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createInquirySchema, type CreateInquirySchema } from '../../schemas/inquiry'
import { createGeneralInquiry } from '../../services/inquiryService'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { FormSubmitButton } from '../../components/ui/FormSubmitButton'
import { BackButton } from '../../components/ui/BackButton'
import { ROUTES } from '../../constants/routes'

export function CreateGeneralInquiryPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateInquirySchema>({
    resolver: zodResolver(createInquirySchema),
  })

  async function onSubmit(data: CreateInquirySchema) {
    setServerError(null)
    try {
      await createGeneralInquiry(data)
      navigate(ROUTES.MY_INQUIRIES)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to submit inquiry.')
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <BackButton className="mb-4" />
      <h1 className="text-2xl font-bold text-slate-800">General Inquiry</h1>
      <p className="mt-1 text-sm text-slate-500">
        Have a question not related to a specific property? Send us a message.
      </p>

      <AlertBanner message={serverError} />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5" noValidate>
        <Input
          label="Title"
          placeholder="Brief summary of your question"
          error={errors.title?.message}
          disabled={isSubmitting}
          {...register('title')}
        />
        <Textarea
          label="Message"
          rows={6}
          placeholder="Describe your inquiry in detail…"
          error={errors.message?.message}
          disabled={isSubmitting}
          {...register('message')}
        />
        <FormSubmitButton
          isLoading={isSubmitting}
          label="Submit Inquiry"
          loadingLabel="Submitting…"
        />
      </form>
    </div>
  )
}
