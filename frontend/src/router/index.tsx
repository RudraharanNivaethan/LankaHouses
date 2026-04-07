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
import { AdminDashboardPage } from '../pages/Admin/AdminDashboardPage'
import { AdminHousesPage } from '../pages/Admin/AdminHousesPage'
import { AdminAddHousePage } from '../pages/Admin/AdminAddHousePage'
import { AdminEditHousePage } from '../pages/Admin/AdminEditHousePage'
import { AdminInquiriesPage } from '../pages/Admin/AdminInquiriesPage'
import { AdminInquiryDetailPage } from '../pages/Admin/AdminInquiryDetailPage'
import { ROUTES, ADMIN_PERMITTED_PATHS } from '../constants/routes'

// Redirects already-authenticated users away from auth pages (login, signup)
function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (isAuthenticated) {
    const target = user?.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.HOME
    return <Navigate to={target} replace />
  }
  return <>{children}</>
}

// Redirects unauthenticated users to login, preserving the intended destination
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />
  return <>{children}</>
}

// Requires authentication AND admin role; non-admins see the 404 page so
// the route's existence is not leaked (indistinguishable from an invalid URL)
function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated || user?.role !== 'admin') return <NotFound />
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

  if (isAuthenticated && user?.role === 'admin') {
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
              <AdminRoute>
                <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_HOUSES}
            element={
              <AdminRoute>
                <AdminHousesPage />
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_ADD_HOUSE}
            element={
              <AdminRoute>
                <AdminAddHousePage />
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_EDIT_HOUSE}
            element={
              <AdminRoute>
                <AdminEditHousePage />
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_INQUIRIES}
            element={
              <AdminRoute>
                <AdminInquiriesPage />
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_INQUIRY_DETAIL}
            element={
              <AdminRoute>
                <AdminInquiryDetailPage />
              </AdminRoute>
            }
          />

          {/* All other routes — wrapped in Navbar + Footer layout */}
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
