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
  /** Present on PATCH /property/:id — whether MongoDB applied a change */
  meta?: {
    modified?: boolean
  }
}

export interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PropertiesListApiResponse {
  success: boolean
  data: PropertyRecord[]
  pagination: PaginationInfo
}

export interface PropertyQueryParams {
  district?: string
  province?: string
  type?: BackendPropertyType
  listingType?: ListingType
  status?: PropertyStatus
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

export interface DeletePropertyApiResponse {
  success: boolean
  message: string
}
