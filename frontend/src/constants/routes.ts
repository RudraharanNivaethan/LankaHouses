import type { PropertyStatus } from '../types/property'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  LISTINGS: '/listings',
  LISTING_DETAIL: '/listings/:id',
  ABOUT: '/about',
  CONTACT: '/contact',
  INQUIRY: '/inquiry',
  MY_INQUIRIES:              '/inquiries/my',
  INQUIRY_DETAIL:            '/inquiries/my/:inquiryId',
  CREATE_GENERAL_INQUIRY:    '/inquiries/new/general',
  CREATE_PROPERTY_INQUIRY:   '/inquiries/new/property/:propertyId',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_HOUSES: '/admin/houses',
  ADMIN_HOUSE_DETAIL: '/admin/houses/:id',
  ADMIN_ADD_HOUSE: '/admin/houses/new',
  ADMIN_EDIT_HOUSE: '/admin/houses/:id/edit',
  ADMIN_INQUIRIES: '/admin/inquiries',
  ADMIN_INQUIRY_DETAIL: '/admin/inquiries/:id',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: '/admin/users/:id',
  ADMIN_CREATE_ADMIN: '/admin/users/new',
} as const

/** Admin houses list filtered by listing lifecycle status (matches API `status` query). */
export function adminHousesListUrl(status: PropertyStatus): string {
  return `${ROUTES.ADMIN_HOUSES}?status=${status}`
}

export function listingDetailPath(id: string): string {
  return ROUTES.LISTING_DETAIL.replace(':id', id)
}

export function adminUserDetailPath(id: string): string {
  return ROUTES.ADMIN_USER_DETAIL.replace(':id', id)
}

export function inquiryDetailPath(inquiryId: string): string {
  return ROUTES.INQUIRY_DETAIL.replace(':inquiryId', inquiryId)
}

export function createPropertyInquiryPath(propertyId: string): string {
  return ROUTES.CREATE_PROPERTY_INQUIRY.replace(':propertyId', propertyId)
}

export function adminInquiryDetailPath(id: string): string {
  return ROUTES.ADMIN_INQUIRY_DETAIL.replace(':id', id)
}

export function adminHouseDetailPath(id: string): string {
  return ROUTES.ADMIN_HOUSE_DETAIL.replace(':id', id)
}

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

/**
 * Public routes that admins are explicitly permitted to view.
 * By default this is empty — admins are redirected to the admin dashboard
 * when they visit any public page not in this list.
 *
 * Add a ROUTES.XXX value here to grant admin access to that public page.
 */
export const ADMIN_PERMITTED_PATHS: readonly string[] = []

