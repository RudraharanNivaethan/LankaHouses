import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../constants/routes'

/**
 * Returns a guard function that either runs the callback (if authenticated)
 * or redirects to login with a `?redirect=` param so the user is returned
 * to the current page after authentication.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) {
      callback()
    } else {
      navigate(
        `${ROUTES.LOGIN}?redirect=${encodeURIComponent(location.pathname + location.search)}`,
      )
    }
  }

  return { requireAuth }
}
