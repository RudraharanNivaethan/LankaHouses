import { useParams } from 'react-router-dom'
import { useProperty } from '../../hooks/useProperty'
import { useUpdateProperty } from '../../hooks/useUpdateProperty'
import { FormShell } from '../ui/FormShell'
import { FormSubmitButton } from '../ui/FormSubmitButton'
import { AlertBanner } from '../ui/AlertBanner'
import { SuccessBanner } from '../ui/SuccessBanner'
import { Spinner } from '../ui/Spinner'
import { PropertyDetailsSection } from '../add-property/PropertyDetailsSection'
import { LocationSection } from '../add-property/LocationSection'
import { ImageUploadSection } from '../add-property/ImageUploadSection'

export function PropertyEditForm() {
  const { id } = useParams<{ id: string }>()
  const { property, isLoading: isFetching, error: fetchError } = useProperty(id)

  const {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isSubmitting,
    images,
    setImages,
    imageError,
    apiError,
    successMessage,
  } = useUpdateProperty(property)

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-brand" />
      </div>
    )
  }

  if (fetchError || !property) {
    return <AlertBanner message={fetchError ?? 'Property not found.'} />
  }

  const existingImageCount = property.images.length

  return (
    <FormShell onSubmit={handleSubmit(onSubmit)} className="gap-6">
      <AlertBanner message={apiError} />
      <SuccessBanner message={successMessage} />

      <PropertyDetailsSection register={register} errors={errors} />
      <LocationSection register={register} errors={errors} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-800">Current Images</h2>
          <p className="mt-1 text-sm text-slate-500">
            This property has {existingImageCount} image{existingImageCount !== 1 ? 's' : ''}.
            Uploading new images will replace all existing ones.
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {property.images.map((img, idx) => (
            <div key={idx} className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200">
              <img
                src={img.url}
                alt={`Current image ${idx + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      <ImageUploadSection
        files={images}
        onFilesChange={setImages}
        error={imageError}
      />

      <div className="flex justify-end">
        <FormSubmitButton
          isLoading={isSubmitting}
          label="Update Property"
          loadingLabel="Updating..."
          size="lg"
          className="w-full sm:w-auto justify-center"
        />
      </div>
    </FormShell>
  )
}
