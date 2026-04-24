import { ROUTES } from '../constants/routes'
import type { User } from '../types/auth'
import { isAdminLike } from './roleUtils'

/**
 * Returns the safe post-authentication destination.
 *
 * - Admin-like roles (admin, superadmin) always go to the admin dashboard.
 * - Regular users go to the `redirect` URL if it's a safe relative path,
 *   otherwise to the home page.
 * - Prevents open-redirect attacks by rejecting absolute URLs and protocol-relative URLs.
 */
export function getPostAuthDestination(
  user: User | null,
  searchParams: URLSearchParams,
): string {
  if (isAdminLike(user?.role)) return ROUTES.ADMIN_DASHBOARD

  const redirect = searchParams.get('redirect')
  const isSafe = redirect && redirect.startsWith('/') && !redirect.startsWith('//')
  return isSafe ? redirect : ROUTES.HOME
}
