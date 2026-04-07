export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  LISTINGS: '/listings',
  ABOUT: '/about',
  CONTACT: '/contact',
  INQUIRY: '/inquiry',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_HOUSES: '/admin/houses',
  ADMIN_ADD_HOUSE: '/admin/houses/new',
  ADMIN_INQUIRIES: '/admin/inquiries',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

