export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Land' | 'Commercial'

/** Used by mock data and PropertyCard (public listing UI) */
export interface Property {
  id: string
  title: string
  location: string
  district: string
  price: number
  type: PropertyType
  bedrooms: number
  bathrooms: number
  areaSqFt: number
  imageUrl: string
  featured?: boolean
}

/** Matches the backend Property mongoose schema */
export interface PropertyImage {
  url: string
  publicId: string
}

export type BackendPropertyType = 'Apartment' | 'House' | 'Villa'
export type ListingType = 'sale' | 'rent'
export type PropertyStatus = 'active' | 'sold' | 'removed'

export interface PropertyRecord {
  _id: string
  title: string
  price: number
  type: BackendPropertyType
  listingType: ListingType
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  furnished: boolean
  yearBuilt: number
  noOfFloors: number
  area: number
  landSize: number
  address: string
  district: string
  province: string
  description: string
  images: PropertyImage[]
  contactNumber: string
  status: PropertyStatus
  createdAt: string
  updatedAt: string
}

export interface PropertyApiResponse {
  success: boolean
  data: PropertyRecord
}
