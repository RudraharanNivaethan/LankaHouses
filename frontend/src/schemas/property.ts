import { z } from 'zod'
import { PROPERTY_TYPES, LISTING_TYPES } from '../constants/property'

export const addPropertySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number' })
    .positive('Price must be a positive number'),
  type: z.enum(PROPERTY_TYPES, { message: 'Select a property type' }),
  listingType: z.enum(LISTING_TYPES, { message: 'Select a listing type' }),
  bedrooms: z.coerce
    .number({ invalid_type_error: 'Bedrooms must be a number' })
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  bathrooms: z.coerce
    .number({ invalid_type_error: 'Bathrooms must be a number' })
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  parkingSpaces: z.coerce
    .number({ invalid_type_error: 'Parking spaces must be a number' })
    .int('Must be a whole number')
    .min(0, 'Cannot be negative'),
  furnished: z.coerce.boolean().optional().default(false),
  yearBuilt: z.coerce
    .number({ invalid_type_error: 'Year built must be a number' })
    .int('Must be a whole number')
    .min(1800, 'Year must be after 1800'),
  noOfFloors: z.coerce
    .number({ invalid_type_error: 'Number of floors must be a number' })
    .int('Must be a whole number')
    .min(1, 'Must have at least 1 floor'),
  area: z.coerce
    .number({ invalid_type_error: 'Area must be a number' })
    .positive('Area must be positive'),
  landSize: z.coerce
    .number({ invalid_type_error: 'Land size must be a number' })
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
})

export type AddPropertySchema = z.infer<typeof addPropertySchema>
