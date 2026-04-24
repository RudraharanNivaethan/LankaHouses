import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Returns a navigate function that automatically stores the current pathname
 * as `location.state.source` on the destination page.
 *
 * Destination pages can read this via `useLocation().state?.source` and pass
 * it to <BackButton /> to return to the exact page that triggered navigation.
 */
export function useNavigateWithSource() {
  const navigate = useNavigate()
  const location = useLocation()
  return (to: string) => navigate(to, { state: { source: location.pathname } })
}
