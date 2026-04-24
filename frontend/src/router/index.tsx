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

// Redirects already-authenticated users away from auth pages (login, signup)
function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (isAuthenticated) {
    const target = user?.permissions.includes('admin.access')
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
 * Generic permission-key guard.
 *
 * Returns the 404 page (not a redirect) so the existence of the route is
 * indistinguishable from an invalid URL — security through obscurity is the
 * intent here.
 *
 * Usage:
 *   <RequirePermission permission={'admin.access'}>
 *     <AdminDashboardPage />
 *   </RequirePermission>
 */
function RequirePermission({ permission, children }: { permission: string; children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated || !user?.permissions.includes(permission)) return <NotFound />
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

  if (isAuthenticated && user?.permissions.includes('admin.access')) {
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

          {/* Admin routes — own layout with sidebar, no public Navbar/Footer */}
          <Route
            path="/admin"
            element={
              <RequirePermission permission={'admin.access'}>
                <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <RequirePermission permission={'admin.access'}>
                <AdminDashboardPage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_HOUSES}
            element={
              <RequirePermission permission={'admin.access'}>
                <AdminHousesPage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_HOUSE_DETAIL}
            element={
              <RequirePermission permission={'admin.access'}>
                <AdminHouseDetailPage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_ADD_HOUSE}
            element={
              <RequirePermission permission={'admin.access'}>
                <AdminAddHousePage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_EDIT_HOUSE}
            element={
              <RequirePermission permission={'admin.access'}>
                <AdminEditHousePage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_INQUIRIES}
            element={
              <RequirePermission permission={'admin.access'}>
                <AdminInquiriesPage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_INQUIRY_DETAIL}
            element={
              <RequirePermission permission={'admin.access'}>
                <AdminInquiryDetailPage />
              </RequirePermission>
            }
          />

          {/* SuperAdmin-only routes */}
          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <RequirePermission permission={'superadmin.access'}>
                <AdminUsersPage />
              </RequirePermission>
            }
          />
          <Route
            path={ROUTES.ADMIN_CREATE_ADMIN}
            element={
              <RequirePermission permission={'superadmin.access'}>
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
