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
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
