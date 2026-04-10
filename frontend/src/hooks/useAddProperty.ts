import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPropertySchema } from '../schemas/property'
import type { AddPropertySchema } from '../schemas/property'
import { createProperty } from '../services/propertyService'
import { MAX_IMAGES, MAX_IMAGE_SIZE_MB } from '../constants/property'

export function useAddProperty() {
  const [images, setImages] = useState<File[]>([])
  const [imageError, setImageError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Zod v4 coerce input types are `unknown`, safe at runtime
  } = useForm<AddPropertySchema>({
    resolver: zodResolver(addPropertySchema) as any,
    defaultValues: {
      furnished: false,
    },
  })

  const onSubmit = async (data: AddPropertySchema) => {
    setApiError(null)
    setSuccessMessage(null)
    setImageError(null)

    if (images.length === 0) {
      setImageError('At least one image is required.')
      return
    }

    if (images.length > MAX_IMAGES) {
      setImageError(`Maximum ${MAX_IMAGES} images allowed.`)
      return
    }

    const maxBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024
    const oversized = images.find((f) => f.size > maxBytes)
    if (oversized) {
      setImageError(`"${oversized.name}" exceeds ${MAX_IMAGE_SIZE_MB}MB limit.`)
      return
    }

    const formData = new FormData()

    for (const [key, value] of Object.entries(data)) {
      formData.append(key, String(value))
    }

    for (const file of images) {
      formData.append('images', file)
    }

    try {
      await createProperty(formData)
      setSuccessMessage('Property created successfully!')
      reset()
      setImages([])
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to create property.')
    }
  }

  return {
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
  }
}
