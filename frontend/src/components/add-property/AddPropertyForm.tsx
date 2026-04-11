import { useAddProperty } from '../../hooks/useAddProperty'
import { FormShell } from '../ui/FormShell'
import { FormSubmitButton } from '../ui/FormSubmitButton'
import { AlertBanner } from '../ui/AlertBanner'
import { SuccessBanner } from '../ui/SuccessBanner'
import { PropertyDetailsSection } from './PropertyDetailsSection'
import { LocationSection } from './LocationSection'
import { ImageUploadSection } from './ImageUploadSection'

export function AddPropertyForm() {
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
  } = useAddProperty()

  return (
    <FormShell onSubmit={handleSubmit(onSubmit)} className="gap-6">
      <AlertBanner message={apiError} />
      <SuccessBanner message={successMessage} />

      <PropertyDetailsSection register={register} errors={errors} />
      <LocationSection register={register} errors={errors} />
      <ImageUploadSection files={images} onFilesChange={setImages} error={imageError} />

      <div className="flex justify-end">
        <FormSubmitButton
          isLoading={isSubmitting}
          label="Create Property"
          loadingLabel="Creating..."
          size="lg"
          className="w-full sm:w-auto justify-center"
        />
      </div>
    </FormShell>
  )
}
