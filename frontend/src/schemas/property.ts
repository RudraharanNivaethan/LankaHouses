import { z } from 'zod'
import { PROPERTY_TYPES, LISTING_TYPES, PROPERTY_STATUSES } from '../constants/property'

export const addPropertySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  price: z.preprocess(
    (val) => {
      if (typeof val === 'number' && Number.isFinite(val)) return Math.trunc(val)
      if (typeof val === 'string') {
        const s = val.replace(/,/g, '').replace(/\s/g, '').trim()
        if (s === '') return undefined
        const n = Number(s)
        return Number.isFinite(n) ? Math.trunc(n) : val
      }
      return val
    },
    z
      .number({ error: 'Price must be a number' })
      .int('Price must be a whole LKR amount')
      .positive('Price must be a positive number'),
  ),
  type: z.enum(PROPERTY_TYPES, { error: 'Select a property type' }),
  listingType: z.enum(LISTING_TYPES, { error: 'Select a listing type' }),
  bedrooms: z.coerce
    .number({ error: 'Bedrooms must be a number' })
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  bathrooms: z.coerce
    .number({ error: 'Bathrooms must be a number' })
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  parkingSpaces: z.coerce
    .number({ error: 'Parking spaces must be a number' })
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  furnished: z.preprocess(
    (val) => {
      if (typeof val === 'boolean') return val
      if (typeof val === 'string') {
        const lower = val.trim().toLowerCase()
        return lower !== 'false' && lower !== '0' && lower !== ''
      }
      return Boolean(val)
    },
    z.boolean({ error: 'Furnished must be a boolean' }),
  ).optional().default(false),
  yearBuilt: z.coerce
    .number({ error: 'Year built must be a number' })
    .int('Must be a whole number')
    .min(1800, 'Year must be after 1800'),
  noOfFloors: z.coerce
    .number({ error: 'Number of floors must be a number' })
    .int('Must be a whole number')
    .min(1, 'Must have at least 1 floor'),
  area: z.coerce
    .number({ error: 'Area must be a number' })
    .positive('Area must be positive'),
  landSize: z.coerce
    .number({ error: 'Land size must be a number' })
    .positive('Land size must be positive'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(300, 'Address must be at most 300 characters'),
  district: z
    .string()
    .min(1, 'District is required')
    .max(100),
  province: z
    .string()
    .min(1, 'Province is required')
    .max(100),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be at most 5000 characters'),
  contactNumber: z
    .string()
    .min(1, 'Contact number is required')
    .max(20, 'Contact number must be at most 20 characters'),
  status: z.enum(PROPERTY_STATUSES).optional(),
})

export type AddPropertySchema = z.infer<typeof addPropertySchema>

export const updatePropertySchema = addPropertySchema.partial()

export type UpdatePropertySchema = z.infer<typeof updatePropertySchema>
