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
}

export function ImageUploadSection({ files, onFilesChange, error }: ImageUploadSectionProps) {
  return (
    <FormSection title="Images" description="Upload property photos. At least one image is required.">
      <div className="sm:col-span-2">
        <FileUpload
          label="Property Images"
          accept={ACCEPTED_IMAGE_TYPES}
          multiple
          maxFiles={MAX_IMAGES}
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
