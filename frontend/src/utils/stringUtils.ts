/**
 * Returns up to two uppercase initials from a full name.
 * e.g. "Jane Doe" → "JD", "Alice" → "A"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}
