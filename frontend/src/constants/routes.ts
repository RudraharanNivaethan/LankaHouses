import type { PropertyStatus } from '../types/property'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  LISTINGS: '/listings',
  /** Public property detail (not admin `/admin/houses/:id`). */
  LISTING_DETAIL: '/listings/:id',
  ABOUT: '/about',
  CONTACT: '/contact',
  INQUIRY: '/inquiry',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_HOUSES: '/admin/houses',
  ADMIN_HOUSE_DETAIL: '/admin/houses/:id',
  ADMIN_ADD_HOUSE: '/admin/houses/new',
  ADMIN_EDIT_HOUSE: '/admin/houses/:id/edit',
  ADMIN_INQUIRIES: '/admin/inquiries',
  ADMIN_INQUIRY_DETAIL: '/admin/inquiries/:id',
} as const

/** Admin houses list filtered by listing lifecycle status (matches API `status` query). */
export function adminHousesListUrl(status: PropertyStatus): string {
  return `${ROUTES.ADMIN_HOUSES}?status=${status}`
}

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

/**
 * Public routes that admins are explicitly permitted to view.
 * By default this is empty — admins are redirected to the admin dashboard
 * when they visit any public page not in this list.
 *
 * Add a ROUTES.XXX value here to grant admin access to that public page.
 */
/** Exact paths; listing detail uses `isAdminAllowedPublicPath`. */
export const ADMIN_PERMITTED_PATHS: readonly string[] = [ROUTES.LISTINGS]

/** Admins may preview public listing + detail without being redirected to the dashboard. */
export function isAdminAllowedPublicPath(pathname: string): boolean {
  if (pathname === ROUTES.LISTINGS) return true
  return /^\/listings\/[^/]+$/.test(pathname)
}

