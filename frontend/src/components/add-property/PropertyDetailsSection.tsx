import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { AddPropertySchema } from '../../schemas/property'
import { FormSection } from '../ui/FormSection'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { PROPERTY_TYPES, LISTING_TYPES } from '../../constants/property'

interface PropertyDetailsSectionProps {
  register: UseFormRegister<AddPropertySchema>
  errors: FieldErrors<AddPropertySchema>
}

const propertyTypeOptions = PROPERTY_TYPES.map((t) => ({ value: t, label: t }))
const listingTypeOptions = LISTING_TYPES.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))

export function PropertyDetailsSection({ register, errors }: PropertyDetailsSectionProps) {
  return (
    <FormSection title="Property Details" description="Basic information about the property.">
      <div className="sm:col-span-2">
        <Input
          label="Title"
          placeholder="e.g. Modern 3-Bedroom Villa in Colombo"
          error={errors.title?.message}
          {...register('title')}
        />
      </div>

      <Input
        label="Price (LKR)"
        type="number"
        placeholder="e.g. 25000000"
        error={errors.price?.message}
        {...register('price')}
      />

      <Select
        label="Property Type"
        options={propertyTypeOptions}
        placeholder="Select type"
        error={errors.type?.message}
        {...register('type')}
      />

      <Select
        label="Listing Type"
        options={listingTypeOptions}
        placeholder="Select listing type"
        error={errors.listingType?.message}
        {...register('listingType')}
      />

      <Input
        label="Bedrooms"
        type="number"
        placeholder="e.g. 3"
        error={errors.bedrooms?.message}
        {...register('bedrooms')}
      />

      <Input
        label="Bathrooms"
        type="number"
        placeholder="e.g. 2"
        error={errors.bathrooms?.message}
        {...register('bathrooms')}
      />

      <Input
        label="Parking Spaces"
        type="number"
        placeholder="e.g. 1"
        error={errors.parkingSpaces?.message}
        {...register('parkingSpaces')}
      />

      <Input
        label="Year Built"
        type="number"
        placeholder="e.g. 2020"
        error={errors.yearBuilt?.message}
        {...register('yearBuilt')}
      />

      <Input
        label="Number of Floors"
        type="number"
        placeholder="e.g. 2"
        error={errors.noOfFloors?.message}
        {...register('noOfFloors')}
      />

      <Input
        label="Area (sq ft)"
        type="number"
        placeholder="e.g. 1500"
        error={errors.area?.message}
        {...register('area')}
      />

      <Input
        label="Land Size (perches)"
        type="number"
        placeholder="e.g. 10"
        error={errors.landSize?.message}
        {...register('landSize')}
      />

      <Input
        label="Contact Number"
        placeholder="e.g. 0771234567"
        error={errors.contactNumber?.message}
        {...register('contactNumber')}
      />

      <div className="flex items-center gap-3 sm:col-span-2">
        <input
          type="checkbox"
          id="furnished"
          className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
          {...register('furnished')}
        />
        <label htmlFor="furnished" className="text-sm font-medium text-slate-700">
          Furnished
        </label>
      </div>

      <div className="sm:col-span-2">
        <Textarea
          label="Description"
          placeholder="Describe the property in detail..."
          rows={5}
          error={errors.description?.message}
          {...register('description')}
        />
      </div>
    </FormSection>
  )
}
