/**
 * Formats an ISO date string for display in the admin panel.
 * Uses en-LK locale consistently across all admin pages.
 * Returns '—' when no date is provided.
 */
export function formatAdminDate(iso: string | undefined | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Formats today's date as a long-form string for the admin welcome banner.
 * e.g. "Wednesday, 23 April 2026"
 */
export function formatAdminLongDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-LK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
