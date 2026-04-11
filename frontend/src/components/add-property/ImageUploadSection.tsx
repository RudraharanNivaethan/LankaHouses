import { FormSection } from '../ui/FormSection'
import { FileUpload } from '../ui/FileUpload'
import {
  MAX_IMAGES,
  MAX_IMAGE_SIZE_MB,
  ACCEPTED_IMAGE_TYPES,
} from '../../constants/property'

interface ImageUploadSectionProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  error?: string | null
  /** Defaults to "Images" */
  sectionTitle?: string
  /** Defaults to create-property copy */
  sectionDescription?: string
  /** Cap on how many files can be selected in this control (e.g. remaining slots when appending) */
  maxFilesOverride?: number
}

export function ImageUploadSection({
  files,
  onFilesChange,
  error,
  sectionTitle = 'Images',
  sectionDescription = 'Upload property photos. At least one image is required.',
  maxFilesOverride,
}: ImageUploadSectionProps) {
  const maxFiles = maxFilesOverride ?? MAX_IMAGES

  return (
    <FormSection title={sectionTitle} description={sectionDescription}>
      <div className="sm:col-span-2">
        <FileUpload
          label="Property Images"
          accept={ACCEPTED_IMAGE_TYPES}
          multiple
          maxFiles={maxFiles}
          maxSizeMB={MAX_IMAGE_SIZE_MB}
          files={files}
          onFilesChange={onFilesChange}
          error={error ?? undefined}
          hint="Accepted formats: JPG, PNG, WebP, AVIF"
        />
      </div>
    </FormSection>
  )
}
