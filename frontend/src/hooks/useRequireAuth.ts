import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../constants/routes'
import { setIntendedRoute } from '../utils/intendedRoute'

/**
 * Returns a guard function that either runs the callback (if authenticated)
 * or stores the current location as the intended post-login destination
 * (sessionStorage) and navigates to the login page.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) {
      callback()
      return
    }
    setIntendedRoute(location.pathname + location.search)
    navigate(ROUTES.LOGIN)
  }

  return { requireAuth }
}
