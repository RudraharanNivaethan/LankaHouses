/**
 * Centralized capture/replay of the user's intended route across login.
 *
 * Persisted in sessionStorage so the value survives a refresh of the login
 * page. Read-and-clear semantics on consume prevent stale intents from
 * affecting future logins. Safe-path validation rejects absolute URLs and
 * protocol-relative URLs to prevent open-redirect abuse.
 */

const KEY = 'auth.intendedRoute'

export function setIntendedRoute(path: string): void {
  try {
    sessionStorage.setItem(KEY, path)
  } catch {
    // sessionStorage may be unavailable (private mode, quota, sandboxed iframe)
  }
}

export function consumeIntendedRoute(): string | null {
  try {
    const stored = sessionStorage.getItem(KEY)
    sessionStorage.removeItem(KEY)
    if (!stored) return null
    const isSafe = stored.startsWith('/') && !stored.startsWith('//')
    return isSafe ? stored : null
  } catch {
    return null
  }
}
