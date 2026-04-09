import { z } from 'zod';

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa'];
const LISTING_TYPES  = ['sale', 'rent'];
const STATUS_VALUES  = ['active', 'sold', 'removed'];

const titleField          = z.string().min(1, 'Title cannot be empty').max(200, 'Title must be at most 200 characters');
const priceField          = z.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be a positive number');
const typeField           = z.enum(PROPERTY_TYPES, { message: `Type must be one of: ${PROPERTY_TYPES.join(', ')}` });
const listingTypeField    = z.enum(LISTING_TYPES,  { message: `Listing type must be one of: ${LISTING_TYPES.join(', ')}` });
const bedroomsField       = z.number({ invalid_type_error: 'Bedrooms must be a number' }).int().min(0, 'Bedrooms cannot be negative');
const bathroomsField      = z.number({ invalid_type_error: 'Bathrooms must be a number' }).int().min(0, 'Bathrooms cannot be negative');
const parkingSpacesField  = z.number({ invalid_type_error: 'Parking spaces must be a number' }).int().min(0, 'Parking spaces cannot be negative');
const furnishedField      = z.boolean({ invalid_type_error: 'Furnished must be a boolean' });
const yearBuiltField      = z.number({ invalid_type_error: 'Year built must be a number' }).int().min(1800, 'Year built must be after 1800');
const noOfFloorsField     = z.number({ invalid_type_error: 'Number of floors must be a number' }).int().min(1, 'Must have at least 1 floor');
const areaField           = z.number({ invalid_type_error: 'Area must be a number' }).positive('Area must be a positive number');
const landSizeField       = z.number({ invalid_type_error: 'Land size must be a number' }).positive('Land size must be a positive number');
const addressField        = z.string().min(1, 'Address cannot be empty').max(300, 'Address must be at most 300 characters');
const districtField       = z.string().min(1, 'District cannot be empty').max(100, 'District must be at most 100 characters');
const provinceField       = z.string().min(1, 'Province cannot be empty').max(100, 'Province must be at most 100 characters');
const descriptionField    = z.string().min(1, 'Description cannot be empty').max(5000, 'Description must be at most 5000 characters');
const imagesField         = z.array(z.string().url('Each image must be a valid URL')).max(20, 'At most 20 images are allowed');
const contactNumberField  = z.string().min(1, 'Contact number cannot be empty').max(20, 'Contact number must be at most 20 characters');
const statusField         = z.enum(STATUS_VALUES, { message: `Status must be one of: ${STATUS_VALUES.join(', ')}` });

export const createPropertySchema = z.object({
  title:         titleField,
  price:         priceField,
  type:          typeField,
  listingType:   listingTypeField,
  bedrooms:      bedroomsField,
  bathrooms:     bathroomsField,
  parkingSpaces: parkingSpacesField,
  furnished:     furnishedField.optional().default(false),
  yearBuilt:     yearBuiltField,
  noOfFloors:    noOfFloorsField,
  area:          areaField,
  landSize:      landSizeField,
  address:       addressField,
  district:      districtField,
  province:      provinceField,
  description:   descriptionField,
  images:        imagesField.optional(),
  contactNumber: contactNumberField,
  status:        statusField.optional(),
});

const updateableFields = [
  'title', 'price', 'type', 'listingType', 'bedrooms', 'bathrooms',
  'parkingSpaces', 'furnished', 'yearBuilt', 'noOfFloors',
  'area', 'landSize', 'address', 'district', 'province',
  'description', 'images', 'contactNumber', 'status',
];

export const updatePropertySchema = z
  .object({
    title:         titleField.optional(),
    price:         priceField.optional(),
    type:          typeField.optional(),
    listingType:   listingTypeField.optional(),
    bedrooms:      bedroomsField.optional(),
    bathrooms:     bathroomsField.optional(),
    parkingSpaces: parkingSpacesField.optional(),
    furnished:     furnishedField.optional(),
    yearBuilt:     yearBuiltField.optional(),
    noOfFloors:    noOfFloorsField.optional(),
    area:          areaField.optional(),
    landSize:      landSizeField.optional(),
    address:       addressField.optional(),
    district:      districtField.optional(),
    province:      provinceField.optional(),
    description:   descriptionField.optional(),
    images:        imagesField.optional(),
    contactNumber: contactNumberField.optional(),
    status:        statusField.optional(),
  })
  .superRefine((data, ctx) => {
    const hasAtLeastOne = updateableFields.some((key) => data[key] !== undefined);
    if (!hasAtLeastOne) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided for update',
      });
    }
  });

export const propertyQuerySchema = z.object({
  district:    districtField.optional(),
  province:    provinceField.optional(),
  type:        typeField.optional(),
  listingType: listingTypeField.optional(),
  status:      statusField.optional(),
  furnished:   z.coerce.boolean().optional(),
  minPrice:    z.coerce.number().positive('minPrice must be a positive number').optional(),
  maxPrice:    z.coerce.number().positive('maxPrice must be a positive number').optional(),
  page:        z.coerce.number().int().min(1, 'Page must be at least 1').optional().default(1),
  limit:       z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').optional().default(20),
});

export const propertyIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid property ID'),
});
