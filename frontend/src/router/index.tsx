import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { HomePage } from '../pages/Home/HomePage'
import { AboutPage } from '../pages/About/AboutPage'
import { ContactPage } from '../pages/Contact/ContactPage'
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
import { AdminUserDetailsPage } from '../pages/Admin/AdminUserDetailsPage'
import { AdminCreateAdminPage } from '../pages/Admin/AdminCreateAdminPage'
import { AdminProfilePage } from '../pages/Admin/AdminProfilePage'
import { MyInquiriesPage } from '../pages/inquiries/MyInquiriesPage'
import { InquiryDetailsPage } from '../pages/inquiries/InquiryDetailsPage'
import { CreateGeneralInquiryPage } from '../pages/inquiries/CreateGeneralInquiryPage'
import { CreatePropertyInquiryPage } from '../pages/inquiries/CreatePropertyInquiryPage'
import { ROUTES, ADMIN_PERMITTED_PATHS } from '../constants/routes'
import { can } from '../utils/can'
import { setIntendedRoute, consumeIntendedRoute } from '../utils/intendedRoute'

/**
 * `properties.manage` is used as the "admin panel entry" capability.
 * All admin-level users hold it; regular users never do.
 * It is a real capability — not a role membership token.
 *
 * If a future role needs panel access without property management,
 * introduce a dedicated `panel.access` capability key in the backend registry.
 */
const ADMIN_ENTRY_CAPABILITY = 'properties.manage'

/**
 * The single post-authentication navigator.
 *
 * Wraps every auth page (login, signup, forgot-password). When auth state
 * flips to authenticated, this effect runs exactly once per transition and
 * routes the user to:
 *   - ADMIN_DASHBOARD if they hold the admin entry capability
 *   - the intended route stored in sessionStorage by a guard, if safe
 *   - HOME otherwise
 *
 * `useEffect` is used instead of a render-time <Navigate> so that
 * consumeIntendedRoute() runs only on commit (not twice during React 18
 * strict-mode double-render), and so this is the only place that owns
 * post-login navigation.
 */
function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoading || !isAuthenticated) return
    if (can(user, ADMIN_ENTRY_CAPABILITY)) {
      consumeIntendedRoute()
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true })
      return
    }
    const target = consumeIntendedRoute() ?? ROUTES.HOME
    navigate(target, { replace: true })
  }, [isLoading, isAuthenticated, user, navigate])

  if (isLoading || isAuthenticated) return null
  return <>{children}</>
}

/**
 * Guard for admin routes. Never redirects to login.
 *
 * Both unauthenticated visitors and authenticated users who lack the required
 * permission receive the same 404 response, making admin routes
 * indistinguishable from non-existent URLs. This prevents route enumeration
 * by observing whether a login redirect or a 404 is returned.
 */
function AdminGuard({ permission, children }: { permission: string; children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated || !can(user, permission)) return <NotFound />
  return <>{children}</>
}

/**
 * Guard for user-facing authenticated routes (e.g. inquiries, profile actions).
 *
 * Unauthenticated visitors are redirected to login with a return URL because
 * the existence of these routes is intentionally public knowledge. Authenticated
 * users who lack the optional permission receive a 404 instead of a redirect or
 * an error message.
 */
function UserGuard({ permission, children }: { permission?: string; children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) return null
  if (!isAuthenticated) {
    setIntendedRoute(location.pathname + location.search)
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  if (permission && !can(user, permission)) return <NotFound />
  return <>{children}</>
}

/**
 * Renders the profile page in the correct layout for the authenticated user.
 * Admins and superadmins get AdminProfilePage (inside AdminShell).
 * Regular users get ProfilePage inside the public Navbar + Footer layout.
 * Unauthenticated users are redirected to login.
 */
function ProfileRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  if (isLoading) return null
  if (!isAuthenticated) {
    setIntendedRoute(location.pathname + location.search)
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  if (can(user, ADMIN_ENTRY_CAPABILITY)) {
    return <AdminProfilePage />
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <ProfilePage />
      </main>
      <Footer />
    </div>
  )
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
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.LISTINGS} element={<ListingsPage />} />
          <Route path={ROUTES.LISTING_DETAIL} element={<ListingDetailPage />} />

          <Route
            path={ROUTES.MY_INQUIRIES}
            element={
              <UserGuard permission="inquiries.submit">
                <MyInquiriesPage />
              </UserGuard>
            }
          />
          <Route
            path={ROUTES.INQUIRY_DETAIL}
            element={
              <UserGuard permission="inquiries.submit">
                <InquiryDetailsPage />
              </UserGuard>
            }
          />
          <Route
            path={ROUTES.CREATE_GENERAL_INQUIRY}
            element={
              <UserGuard permission="inquiries.submit">
                <CreateGeneralInquiryPage />
              </UserGuard>
            }
          />
          <Route
            path={ROUTES.CREATE_PROPERTY_INQUIRY}
            element={
              <UserGuard permission="inquiries.submit">
                <CreatePropertyInquiryPage />
              </UserGuard>
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

          {/* Admin routes — capability-gated via AdminGuard, which returns 404 for
              all unauthorized visitors (guests and wrong-permission users alike).
              This ensures admin route existence cannot be inferred from response
              differences (e.g. login redirect vs 404). */}
          <Route
            path="/admin"
            element={
              <AdminGuard permission="properties.manage">
                <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
              </AdminGuard>
            }
          />
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <AdminGuard permission="properties.stats.read">
                <AdminDashboardPage />
              </AdminGuard>
            }
          />
          <Route
            path={ROUTES.ADMIN_HOUSES}
            element={
              <AdminGuard permission="properties.manage">
                <AdminHousesPage />
              </AdminGuard>
            }
          />
          <Route
            path={ROUTES.ADMIN_HOUSE_DETAIL}
            element={
              <AdminGuard permission="properties.manage">
                <AdminHouseDetailPage />
              </AdminGuard>
            }
          />
          <Route
            path={ROUTES.ADMIN_ADD_HOUSE}
            element={
              <AdminGuard permission="properties.manage">
                <AdminAddHousePage />
              </AdminGuard>
            }
          />
          <Route
            path={ROUTES.ADMIN_EDIT_HOUSE}
            element={
              <AdminGuard permission="properties.manage">
                <AdminEditHousePage />
              </AdminGuard>
            }
          />
          <Route
            path={ROUTES.ADMIN_INQUIRIES}
            element={
              <AdminGuard permission="inquiries.manage">
                <AdminInquiriesPage />
              </AdminGuard>
            }
          />
          <Route
            path={ROUTES.ADMIN_INQUIRY_DETAIL}
            element={
              <AdminGuard permission="inquiries.manage">
                <AdminInquiryDetailPage />
              </AdminGuard>
            }
          />

          {/* Superadmin-capability routes — each gated by its specific capability */}
          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <AdminGuard permission="users.read">
                <AdminUsersPage />
              </AdminGuard>
            }
          />
          <Route
            path={ROUTES.ADMIN_USER_DETAIL}
            element={
              <AdminGuard permission="users.read">
                <AdminUserDetailsPage />
              </AdminGuard>
            }
          />
          <Route
            path={ROUTES.ADMIN_CREATE_ADMIN}
            element={
              <AdminGuard permission="admins.create">
                <AdminCreateAdminPage />
              </AdminGuard>
            }
          />

          {/* Profile — top-level so it is reachable by all roles */}
          <Route path={ROUTES.PROFILE} element={<ProfileRoute />} />

          {/* All other routes — wrapped in Navbar + Footer layout */}
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
