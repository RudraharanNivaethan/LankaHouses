import type { PropertyStatus } from '../types/property'

export const PROPERTY_TYPES = ['Apartment', 'House', 'Villa'] as const
export const LISTING_TYPES = ['sale', 'rent'] as const
export const PROPERTY_STATUSES = ['active', 'sold', 'removed'] as const

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  active: 'Active',
  sold: 'Sold',
  removed: 'Removed',
}

export const STATUS_COLORS: Record<PropertyStatus, { bg: string; text: string; dot: string }> = {
  active:  { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  sold:    { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  removed: { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500'     },
}

export const DEFAULT_PAGE_LIMIT = 20

export const MAX_IMAGES = 10
export const MAX_IMAGE_SIZE_MB = 5
export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/jpg,image/png,image/webp,image/avif'

export const SRI_LANKA_PROVINCES = [
  'Central',
  'Eastern',
  'North Central',
  'Northern',
  'North Western',
  'Sabaragamuwa',
  'Southern',
  'Uva',
  'Western',
] as const

export const SRI_LANKA_DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
] as const
