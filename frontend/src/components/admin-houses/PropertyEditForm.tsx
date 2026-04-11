import { useState } from 'react'
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
import { appendPropertyImages, removePropertyImage } from '../../services/propertyService'
import { MAX_IMAGES, MAX_IMAGE_SIZE_MB } from '../../constants/property'

export function PropertyEditForm() {
  const { id } = useParams<{ id: string }>()
  const { property, isLoading: isFetching, error: fetchError, refetch } = useProperty(id)

  const {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isSubmitting,
    apiError,
    successMessage,
    noticeMessage,
  } = useUpdateProperty(property)

  const [appendFiles, setAppendFiles] = useState<File[]>([])
  const [appendBusy, setAppendBusy] = useState(false)
  const [removeBusyIndex, setRemoveBusyIndex] = useState<number | null>(null)
  const [imageSuccess, setImageSuccess] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-brand" />
      </div>
    )
  }

  if (fetchError || !property || !id) {
    return <AlertBanner message={fetchError ?? 'Property not found.'} />
  }

  const existingImageCount = property.images.length
  const remainingSlots = Math.max(0, MAX_IMAGES - existingImageCount)
  const canRemoveImage = existingImageCount > 1

  const clearImageMessages = () => {
    setImageSuccess(null)
    setImageError(null)
  }

  const handleRemoveImage = async (imageIndex: number) => {
    clearImageMessages()
    setRemoveBusyIndex(imageIndex)
    try {
      await removePropertyImage(property._id, imageIndex)
      setImageSuccess('Image removed.')
      await refetch()
    } catch (e) {
      setImageError(e instanceof Error ? e.message : 'Failed to remove image.')
    } finally {
      setRemoveBusyIndex(null)
    }
  }

  const handleAppendImages = async () => {
    clearImageMessages()
    if (appendFiles.length === 0) {
      setImageError('Choose one or more images to add.')
      return
    }
    if (existingImageCount + appendFiles.length > MAX_IMAGES) {
      setImageError(`You can add at most ${remainingSlots} more image(s) (limit ${MAX_IMAGES} total).`)
      return
    }
    const maxBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024
    const oversized = appendFiles.find((f) => f.size > maxBytes)
    if (oversized) {
      setImageError(`"${oversized.name}" exceeds ${MAX_IMAGE_SIZE_MB}MB limit.`)
      return
    }

    setAppendBusy(true)
    try {
      await appendPropertyImages(property._id, appendFiles)
      setImageSuccess(`${appendFiles.length} image(s) added.`)
      setAppendFiles([])
      await refetch()
    } catch (e) {
      setImageError(e instanceof Error ? e.message : 'Failed to upload images.')
    } finally {
      setAppendBusy(false)
    }
  }

  return (
    <FormShell onSubmit={handleSubmit(onSubmit)} className="gap-6">
      <AlertBanner message={apiError} />
      <SuccessBanner message={successMessage} />
      {noticeMessage ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
        >
          {noticeMessage}
        </div>
      ) : null}

      <PropertyDetailsSection register={register} errors={errors} />
      <LocationSection register={register} errors={errors} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-800">Property images</h2>
          <p className="mt-1 text-sm text-slate-500">
            {existingImageCount} of {MAX_IMAGES} images in the gallery. Remove an image
            explicitly before it is deleted from Cloudinary. New uploads are appended — they do not replace the
            gallery unless you remove older images first.
          </p>
        </div>

        <AlertBanner message={imageError} />
        <SuccessBanner message={imageSuccess} />

        <div className="flex flex-wrap gap-3">
          {property.images.map((img, idx) => (
            <div key={`${img.publicId}-${idx}`} className="relative shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-lg border border-slate-200">
                <img
                  src={img.url}
                  alt={`Image ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <button
                type="button"
                disabled={!canRemoveImage || removeBusyIndex !== null}
                title={canRemoveImage ? 'Remove this image' : 'A property must keep at least one image.'}
                onClick={() => void handleRemoveImage(idx)}
                className="mt-1.5 w-full rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {removeBusyIndex === idx ? 'Removing…' : 'Remove'}
              </button>
            </div>
          ))}
        </div>

        {remainingSlots > 0 ? (
          <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
            <ImageUploadSection
              files={appendFiles}
              onFilesChange={setAppendFiles}
              error={null}
              sectionTitle="Add more photos"
              sectionDescription={`Select up to ${remainingSlots} file(s) to append (${remainingSlots} slot${remainingSlots !== 1 ? 's' : ''} left).`}
              maxFilesOverride={remainingSlots}
            />
            <button
              type="button"
              disabled={appendBusy || appendFiles.length === 0}
              onClick={() => void handleAppendImages()}
              className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {appendBusy
                ? 'Uploading…'
                : appendFiles.length === 0
                  ? 'Upload selected images'
                  : `Upload ${appendFiles.length} image${appendFiles.length === 1 ? '' : 's'}`}
            </button>
          </div>
        ) : (
          <p className="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-600">
            This property already has the maximum of {MAX_IMAGES} images. Remove one to add more.
          </p>
        )}
      </section>

      <div className="flex justify-end">
        <FormSubmitButton
          isLoading={isSubmitting}
          label="Save property details"
          loadingLabel="Saving…"
          size="lg"
          className="w-full sm:w-auto justify-center"
        />
      </div>
    </FormShell>
  )
}
