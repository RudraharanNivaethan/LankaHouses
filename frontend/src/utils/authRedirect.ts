import { ROUTES } from '../constants/routes'
import type { User } from '../types/auth'

/**
 * Returns the safe post-authentication destination.
 *
 * - Users who can manage properties (all admin-level users) land on the
 *   admin dashboard. `properties.manage` is used as the admin entry capability
 *   — it is a real backend-defined capability, not a role token.
 * - Regular users go to the `redirect` URL if it's a safe relative path,
 *   otherwise to the home page.
 * - Prevents open-redirect attacks by rejecting absolute URLs and
 *   protocol-relative URLs.
 */
export function getPostAuthDestination(
  user: User | null,
  searchParams: URLSearchParams,
): string {
  if (user?.permissions.includes('properties.manage')) return ROUTES.ADMIN_DASHBOARD

  const redirect = searchParams.get('redirect')
  const isSafe = redirect && redirect.startsWith('/') && !redirect.startsWith('//')
  return isSafe ? redirect : ROUTES.HOME
}
