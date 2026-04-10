import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { AddPropertySchema } from '../../schemas/property'
import { FormSection } from '../ui/FormSection'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { SRI_LANKA_DISTRICTS, SRI_LANKA_PROVINCES } from '../../constants/property'

interface LocationSectionProps {
  register: UseFormRegister<AddPropertySchema>
  errors: FieldErrors<AddPropertySchema>
}

const districtOptions = SRI_LANKA_DISTRICTS.map((d) => ({ value: d, label: d }))
const provinceOptions = SRI_LANKA_PROVINCES.map((p) => ({ value: p, label: p }))

export function LocationSection({ register, errors }: LocationSectionProps) {
  return (
    <FormSection title="Location" description="Where the property is located.">
      <div className="sm:col-span-2">
        <Input
          label="Address"
          placeholder="e.g. 42 Galle Road, Colombo 03"
          error={errors.address?.message}
          {...register('address')}
        />
      </div>

      <Select
        label="District"
        options={districtOptions}
        placeholder="Select district"
        defaultValue=""
        error={errors.district?.message}
        {...register('district')}
      />

      <Select
        label="Province"
        options={provinceOptions}
        placeholder="Select province"
        defaultValue=""
        error={errors.province?.message}
        {...register('province')}
      />
    </FormSection>
  )
}
