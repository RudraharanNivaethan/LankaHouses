import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPropertySchema } from '../schemas/property'
import type { AddPropertySchema } from '../schemas/property'
import { updateProperty } from '../services/propertyService'
import type { PropertyRecord } from '../types/property'
import { getClientErrorMessage } from '../utils/errorMessages'

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
    status:        record.status,
  }
}

export interface UseUpdatePropertyOptions {
  /** Called after the server confirms fields were saved (`meta.modified === true`). e.g. navigate to detail view. */
  onFieldsSaved?: (record: PropertyRecord) => void
}

export function useUpdateProperty(
  existing: PropertyRecord | null,
  options?: UseUpdatePropertyOptions,
) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null)

  // Memoised to give react-hook-form a stable reference.
  // A new object is only produced when `existing` itself changes (i.e. a
  // different property is loaded), preventing unnecessary form resets while
  // the user is editing.
  const existingValues = useMemo(
    () => (existing ? toFormValues(existing) : undefined),
    [existing],
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Zod coerce input types are `unknown`, safe at runtime
  } = useForm<AddPropertySchema>({
    resolver: zodResolver(addPropertySchema) as any,
    // `values` synchronously populates the form whenever `existingValues`
    // changes, replacing the fragile useEffect+reset() pattern that had a
    // timing gap in production React 18 concurrent mode.
    values: existingValues,
    // Do not overwrite fields the user has already edited (e.g. after an image
    // refetch triggers a new `existing` reference for the same property).
    resetOptions: { keepDirtyValues: true },
  })

  const onSubmit = async (data: AddPropertySchema) => {
    if (!existing) return

    setApiError(null)
    setSuccessMessage(null)
    setNoticeMessage(null)

    try {
      const result = await updateProperty(existing._id, data)

      if (result.success !== true) {
        setApiError('The server did not confirm this update.')
        return
      }

      if (result.meta?.modified === true) {
        reset(toFormValues(result.data))
        if (options?.onFieldsSaved) {
          options.onFieldsSaved(result.data)
        } else {
          setSuccessMessage('Property updated successfully!')
        }
        return
      }

      if (result.meta?.modified === false) {
        setNoticeMessage('No changes were saved — the listing already matched what you submitted.')
        reset(toFormValues(result.data))
        return
      }

      setApiError('Could not confirm the database was updated. Please refresh the page.')
      reset(toFormValues(result.data))
    } catch (err) {
      setApiError(getClientErrorMessage(err))
    }
  }

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isSubmitting,
    apiError,
    successMessage,
    noticeMessage,
    setValue,
    watch,
  }
}
