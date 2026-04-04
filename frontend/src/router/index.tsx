import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { HomePage } from '../pages/Home/HomePage'
import { LoginPage } from '../pages/Auth/LoginPage'
import { SignupPage } from '../pages/Auth/SignupPage'
import { ROUTES } from '../constants/routes'

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
      <Routes>
        {/* Auth pages — full-screen, no Navbar/Footer */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

        {/* All other routes — wrapped in Navbar + Footer layout */}
        <Route path="*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
