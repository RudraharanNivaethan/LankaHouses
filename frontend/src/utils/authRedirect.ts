import { ROUTES } from '../constants/routes'
import type { User } from '../types/auth'

/**
 * Returns the safe post-authentication destination.
 *
 * - Users whose backend-supplied permissions include 'admin.access' always
 *   land on the admin dashboard.
 * - Regular users go to the `redirect` URL if it's a safe relative path,
 *   otherwise to the home page.
 * - Prevents open-redirect attacks by rejecting absolute URLs and
 *   protocol-relative URLs.
 */
export function getPostAuthDestination(
  user: User | null,
  searchParams: URLSearchParams,
): string {
  if (user?.permissions.includes('admin.access')) return ROUTES.ADMIN_DASHBOARD

  const redirect = searchParams.get('redirect')
  const isSafe = redirect && redirect.startsWith('/') && !redirect.startsWith('//')
  return isSafe ? redirect : ROUTES.HOME
}
