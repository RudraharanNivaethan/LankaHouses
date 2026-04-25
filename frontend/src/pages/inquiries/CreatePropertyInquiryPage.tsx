import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createInquirySchema, type CreateInquirySchema } from '../../schemas/inquiry'
import { createPropertyInquiry } from '../../services/inquiryService'
import { getPropertyById } from '../../services/propertyService'
import type { PropertyRecord } from '../../types/property'
import { PropertyPreviewCard } from '../../components/inquiries/PropertyPreviewCard'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { AlertBanner } from '../../components/ui/AlertBanner'
import { FormSubmitButton } from '../../components/ui/FormSubmitButton'
import { BackButton } from '../../components/ui/BackButton'
import { ROUTES } from '../../constants/routes'

export function CreatePropertyInquiryPage() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<PropertyRecord | null>(null)
  const [propertyLoading, setPropertyLoading] = useState(true)
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    if (!propertyId) return
    setPropertyLoading(true)
    getPropertyById(propertyId)
      .then((res) => setProperty(res.data))
      .catch(() => setProperty(null))
      .finally(() => setPropertyLoading(false))
  }, [propertyId])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateInquirySchema>({
    resolver: zodResolver(createInquirySchema),
  })

  async function onSubmit(data: CreateInquirySchema) {
    if (!propertyId) return
    setServerError(null)
    try {
      await createPropertyInquiry(propertyId, data)
      navigate(ROUTES.MY_INQUIRIES)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to submit inquiry.')
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <BackButton className="mb-4" />
      <h1 className="text-2xl font-bold text-slate-800">Property Inquiry</h1>
      <p className="mt-1 text-sm text-slate-500">Send a question about this specific property.</p>

      <div className="mt-4">
        <PropertyPreviewCard property={property} isLoading={propertyLoading} />
      </div>

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
          placeholder="What would you like to know about this property?"
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
