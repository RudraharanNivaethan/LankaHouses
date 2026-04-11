import { z } from 'zod';

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa'];
const LISTING_TYPES  = ['sale', 'rent'];
const STATUS_VALUES  = ['active', 'sold', 'removed'];

const titleField          = z.string().min(1, 'Title cannot be empty').max(200, 'Title must be at most 200 characters');
const priceField          = z.preprocess(
  (val) => {
    if (typeof val === 'number' && Number.isFinite(val)) return Math.trunc(val);
    if (typeof val === 'string') {
      const s = val.replace(/,/g, '').replace(/\s/g, '').trim();
      if (s === '') return undefined;
      const n = Number(s);
      return Number.isFinite(n) ? Math.trunc(n) : val;
    }
    return val;
  },
  z.number({ error: 'Price must be a number' }).int('Price must be a whole LKR amount').positive('Price must be a positive number'),
);
const typeField           = z.enum(PROPERTY_TYPES, { error: `Type must be one of: ${PROPERTY_TYPES.join(', ')}` });
const listingTypeField    = z.enum(LISTING_TYPES,  { error: `Listing type must be one of: ${LISTING_TYPES.join(', ')}` });
const bedroomsField       = z.coerce.number({ error: 'Bedrooms must be a number' }).int().min(0, 'Bedrooms cannot be negative');
const bathroomsField      = z.coerce.number({ error: 'Bathrooms must be a number' }).int().min(0, 'Bathrooms cannot be negative');
const parkingSpacesField  = z.coerce.number({ error: 'Parking spaces must be a number' }).int().min(0, 'Parking spaces cannot be negative');
const furnishedField      = z.preprocess(
  (val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const lower = val.trim().toLowerCase();
      return lower !== 'false' && lower !== '0' && lower !== '';
    }
    return Boolean(val);
  },
  z.boolean({ error: 'Furnished must be a boolean' }),
);
const yearBuiltField      = z.coerce.number({ error: 'Year built must be a number' }).int().min(1800, 'Year built must be after 1800');
const noOfFloorsField     = z.coerce.number({ error: 'Number of floors must be a number' }).int().min(1, 'Must have at least 1 floor');
const areaField           = z.coerce.number({ error: 'Area must be a number' }).positive('Area must be a positive number');
const landSizeField       = z.coerce.number({ error: 'Land size must be a number' }).positive('Land size must be a positive number');
const addressField        = z.string().min(1, 'Address cannot be empty').max(300, 'Address must be at most 300 characters');
const districtField       = z.string().min(1, 'District cannot be empty').max(100, 'District must be at most 100 characters');
const provinceField       = z.string().min(1, 'Province cannot be empty').max(100, 'Province must be at most 100 characters');
const descriptionField    = z.string().min(1, 'Description cannot be empty').max(5000, 'Description must be at most 5000 characters');
const contactNumberField  = z.string().min(1, 'Contact number cannot be empty').max(20, 'Contact number must be at most 20 characters');
const statusField         = z.enum(STATUS_VALUES, { error: `Status must be one of: ${STATUS_VALUES.join(', ')}` });

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
  contactNumber: contactNumberField,
  status:        statusField.optional(),
});

export const updatePropertySchema = z.object({
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
  contactNumber: contactNumberField.optional(),
  status:        statusField.optional(),
});

export const propertyQuerySchema = z.object({
  district:    districtField.optional(),
  province:    provinceField.optional(),
  type:        typeField.optional(),
  listingType: listingTypeField.optional(),
  status:      statusField.optional(),
  furnished:   furnishedField.optional(),
  minPrice:    z.coerce.number().positive('minPrice must be a positive number').optional(),
  maxPrice:    z.coerce.number().positive('maxPrice must be a positive number').optional(),
  page:        z.coerce.number().int().min(1, 'Page must be at least 1').optional().default(1),
  limit:       z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').optional().default(20),
});

export const propertyIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid property ID'),
});

export const propertyImageIndexSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid property ID'),
  imageIndex: z.coerce.number({ error: 'Image index must be a number' }).int('Image index must be an integer').min(0, 'Image index cannot be negative'),
});
