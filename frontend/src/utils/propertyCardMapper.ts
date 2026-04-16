import type { Property, PropertyRecord } from '../types/property'

/** Neutral placeholder when `images` is empty (invalid listing; keeps layout stable). */
const LISTING_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'

/**
 * Maps an API property to the `Property` shape used by [`PropertyCard`](../components/ui/PropertyCard.tsx).
 */
export function propertyRecordToFeaturedCardProperty(record: PropertyRecord): Property {
  return {
    id: record._id,
    title: record.title,
    location: `${record.district}, ${record.province}`,
    district: record.district,
    price: record.price,
    type: record.type,
    bedrooms: record.bedrooms,
    bathrooms: record.bathrooms,
    areaSqFt: record.area,
    imageUrl: record.images[0]?.url ?? LISTING_IMAGE_FALLBACK,
  }
}
