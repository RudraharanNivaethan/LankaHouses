import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { HomePage } from '../pages/Home/HomePage'
import { LoginPage } from '../pages/Auth/LoginPage'
import { SignupPage } from '../pages/Auth/SignupPage'
import { ForgotPasswordPage } from '../pages/Auth/ForgotPasswordPage'
import { ProfilePage } from '../pages/Profile/ProfilePage'
import { ListingsPage } from '../pages/Listings/ListingsPage'
import { ListingDetailPage } from '../pages/Listings/ListingDetailPage'
import { AdminDashboardPage } from '../pages/Admin/AdminDashboardPage'
import { AdminHousesPage } from '../pages/Admin/AdminHousesPage'
import { AdminAddHousePage } from '../pages/Admin/AdminAddHousePage'
import { AdminEditHousePage } from '../pages/Admin/AdminEditHousePage'
import { AdminHouseDetailPage } from '../pages/Admin/AdminHouseDetailPage'
import { AdminInquiriesPage } from '../pages/Admin/AdminInquiriesPage'
import { AdminInquiryDetailPage } from '../pages/Admin/AdminInquiryDetailPage'
import { AdminUsersPage } from '../pages/Admin/AdminUsersPage'
import { AdminCreateAdminPage } from '../pages/Admin/AdminCreateAdminPage'
import { ROUTES, ADMIN_PERMITTED_PATHS } from '../constants/routes'
import { can } from '../utils/can'

/**
 * `properties.manage` is used as the "admin panel entry" capability.
 * All admin-level users hold it; regular users never do.
 * It is a real capability — not a role membership token.
 *
 * If a future role needs panel access without property management,
 * introduce a dedicated `panel.access` capability key in the backend registry.
 */
const ADMIN_ENTRY_CAPABILITY = 'properties.manage'

// Redirects already-authenticated users away from auth pages (login, signup)
function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (isAuthenticated) {
    const target = can(user, ADMIN_ENTRY_CAPABILITY)
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.HOME
    return <Navigate to={target} replace />
  }
  return <>{children}</>
}

// Redirects unauthenticated users to login, preserving the intended destination
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) return null
  if (!isAuthenticated) {
    const loginUrl = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(location.pathname + location.search)}`
    return <Navigate to={loginUrl} replace />
  }
  return <>{children}</>
}

/**
 * Capability-based route guard.
 *
 * Accepts any permission key string from the backend registry.
 * Returns the 404 page (not a redirect) so the route's existence is
 * indistinguishable from an invalid URL.
 *
 * Usage: <RequirePermission permission="properties.manage">
 */
function RequirePermission({ permission, children }: { permission: string; children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated || !can(user, permission)) return <NotFound />
  return <>{children}</>
}

function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center">
      <p className="text-6xl font-bold text-slate-200">404</p>
      <p className="text-lg font-medium text-slate-500">Page not found</p>
      <Link
        to={ROUTES.HOME}
        className="mt-2 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
      >
        ← Back to home
      </Link>
    </div>
  )
}

function MainLayout() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null

  if (isAuthenticated && can(user, ADMIN_ENTRY_CAPABILITY)) {
    if (!ADMIN_PERMITTED_PATHS.includes(location.pathname)) {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LISTINGS} element={<ListingsPage />} />
          <Route path={ROUTES.LISTING_DETAIL} element={<ListingDetailPage />} />

          {/* Protected routes */}
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all: prevents blank screen for registered-but-unbuilt routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export { ProtectedRoute }

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth pages — full-screen, no Navbar/Footer; redirect if already logged in */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <RedirectIfAuthenticated>
                <LoginPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path={ROUTES.SIGNUP}
            element={
              <RedirectIfAuthenticated>
                <SignupPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={
              <RedirectIfAuthenticated>
                <ForgotPasswordPage />
              </RedirectIfAuthenticated>
            }
          />

          {/* Admin routes — capability-gated, each route uses the specific capability it requires */}
          <Route
            path="/admin"
            element={
              <RequirePermission permission="properties.manage">
                <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <RequirePermission permission="properties.stats.read">
                <AdminDashboardPage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_HOUSES}
            element={
              <RequirePermission permission="properties.manage">
                <AdminHousesPage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_HOUSE_DETAIL}
            element={
              <RequirePermission permission="properties.manage">
                <AdminHouseDetailPage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_ADD_HOUSE}
            element={
              <RequirePermission permission="properties.manage">
                <AdminAddHousePage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_EDIT_HOUSE}
            element={
              <RequirePermission permission="properties.manage">
                <AdminEditHousePage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_INQUIRIES}
            element={
              <RequirePermission permission="inquiries.manage">
                <AdminInquiriesPage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_INQUIRY_DETAIL}
            element={
              <RequirePermission permission="inquiries.manage">
                <AdminInquiryDetailPage />
              </RequirePermission>
            }
          />

          {/* Superadmin-capability routes — each gated by its specific capability */}
          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <RequirePermission permission="users.read">
                <AdminUsersPage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_CREATE_ADMIN}
            element={
              <RequirePermission permission="admins.create">
                <AdminCreateAdminPage />
              </RequirePermission>
            }
          />

          {/* All other routes — wrapped in Navbar + Footer layout */}
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
