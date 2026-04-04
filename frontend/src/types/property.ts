export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Land' | 'Commercial'

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
