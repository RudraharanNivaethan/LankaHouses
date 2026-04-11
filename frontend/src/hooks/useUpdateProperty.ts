import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPropertySchema } from '../schemas/property'
import type { AddPropertySchema } from '../schemas/property'
import { updateProperty } from '../services/propertyService'
import type { PropertyRecord } from '../types/property'
import { MAX_IMAGES, MAX_IMAGE_SIZE_MB } from '../constants/property'

function toFormValues(record: PropertyRecord): AddPropertySchema {
  return {
    title:         record.title,
    price:         record.price,
    type:          record.type,
    listingType:   record.listingType,
    bedrooms:      record.bedrooms,
    bathrooms:     record.bathrooms,
    parkingSpaces: record.parkingSpaces,
    furnished:     record.furnished,
    yearBuilt:     record.yearBuilt,
    noOfFloors:    record.noOfFloors,
    area:          record.area,
    landSize:      record.landSize,
    address:       record.address,
    district:      record.district,
    province:      record.province,
    description:   record.description,
    contactNumber: record.contactNumber,
  }
}

export function useUpdateProperty(existing: PropertyRecord | null) {
  const [images, setImages] = useState<File[]>([])
  const [imageError, setImageError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Zod coerce input types are `unknown`, safe at runtime
  } = useForm<AddPropertySchema>({
    resolver: zodResolver(addPropertySchema) as any,
  })

  useEffect(() => {
    if (existing) {
      reset(toFormValues(existing))
    }
  }, [existing, reset])

  const onSubmit = async (data: AddPropertySchema) => {
    // #region agent log
    fetch('http://127.0.0.1:7519/ingest/11654d97-9cc3-416d-a99c-824b52497e57',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d6a3ce'},body:JSON.stringify({sessionId:'d6a3ce',location:'useUpdateProperty.ts:onSubmit-entry',message:'onSubmit called',data:{existingId:existing?._id,existingPrice:existing?.price,dataPrice:(data as Record<string,unknown>).price,dataTitle:(data as Record<string,unknown>).title,existingIsNull:existing===null},timestamp:Date.now(),hypothesisId:'H1-H4'})}).catch(()=>{});
    // #endregion
    if (!existing) return

    setApiError(null)
    setSuccessMessage(null)
    setImageError(null)

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
      if (value !== undefined) formData.append(key, String(value))
    }

    for (const file of images) {
      formData.append('images', file)
    }

    // #region agent log
    const formDataEntries: Record<string,string> = {}
    formData.forEach((v,k) => { formDataEntries[k] = typeof v === 'string' ? v : '[File]' })
    fetch('http://127.0.0.1:7519/ingest/11654d97-9cc3-416d-a99c-824b52497e57',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d6a3ce'},body:JSON.stringify({sessionId:'d6a3ce',location:'useUpdateProperty.ts:formData-built',message:'FormData entries before fetch',data:{entries:formDataEntries,entryCount:Object.keys(formDataEntries).length,propertyId:existing._id},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
    // #endregion

    try {
      const result = await updateProperty(existing._id, formData)
      // #region agent log
      fetch('http://127.0.0.1:7519/ingest/11654d97-9cc3-416d-a99c-824b52497e57',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d6a3ce'},body:JSON.stringify({sessionId:'d6a3ce',location:'useUpdateProperty.ts:update-success',message:'updateProperty resolved',data:{responsePrice:result.data.price,responseTitle:result.data.title,responseId:result.data._id,responseStatus:result.data.status},timestamp:Date.now(),hypothesisId:'H2-H3'})}).catch(()=>{});
      // #endregion
      setSuccessMessage('Property updated successfully!')
      setImages([])
      reset(toFormValues(result.data))
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7519/ingest/11654d97-9cc3-416d-a99c-824b52497e57',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d6a3ce'},body:JSON.stringify({sessionId:'d6a3ce',location:'useUpdateProperty.ts:update-error',message:'updateProperty threw error',data:{error:err instanceof Error?err.message:String(err)},timestamp:Date.now(),hypothesisId:'H2-H3'})}).catch(()=>{});
      // #endregion
      setApiError(err instanceof Error ? err.message : 'Failed to update property.')
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
