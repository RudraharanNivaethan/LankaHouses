import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { HomePage } from '../pages/Home/HomePage'
import { LoginPage } from '../pages/Auth/LoginPage'
import { SignupPage } from '../pages/Auth/SignupPage'
import { ROUTES } from '../constants/routes'

// Redirects already-authenticated users away from auth pages
function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (isAuthenticated) return <Navigate to={ROUTES.HOME} replace />
  return <>{children}</>
}

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
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

          {/* All other routes — wrapped in Navbar + Footer layout */}
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
