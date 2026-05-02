/**
 * Centralised user-facing error message maps.
 * All frontend error strings must come from here — never from raw error objects.
 */

// ─── Firebase Auth ─────────────────────────────────────────────────────────────

export const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential':      'Invalid email or password.',
  'auth/user-not-found':          'Invalid email or password.',
  'auth/wrong-password':          'Invalid email or password.',
  'auth/too-many-requests':       'Too many failed attempts. Please try again later or reset your password.',
  'auth/user-disabled':           'This account has been disabled. Please contact support.',
  'auth/network-request-failed':  'Network error. Please check your connection and try again.',
  'auth/email-already-in-use':    'An account with this email already exists.',
  'auth/weak-password':           'Password must be at least 6 characters.',
  'auth/popup-closed-by-user':    'Sign-in was cancelled. Please try again.',
  'auth/popup-blocked':           'Sign-in popup was blocked. Please allow popups and try again.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
};

// ─── API / server error codes ──────────────────────────────────────────────────

export const API_ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND:        'The requested resource was not found.',
  UNAUTHORIZED:     'Please log in to continue.',
  FORBIDDEN:        'You do not have permission to perform this action.',
  RATE_LIMIT:       'Too many requests. Please slow down.',
  INTERNAL_ERROR:   'Something went wrong on our end. Please try again later.',
};

const GENERIC_ERROR = 'An unexpected error occurred. Please try again.';

// ─── Lookup helpers ────────────────────────────────────────────────────────────

/**
 * Returns a user-safe message for a Firebase Auth error code.
 */
export function getFirebaseErrorMessage(code: string): string {
  return FIREBASE_ERROR_MESSAGES[code] ?? GENERIC_ERROR;
}

/**
 * Returns a user-safe message for any error.
 * Checks for a known API error code first, then falls back to the generic message.
 */
export function getClientErrorMessage(error: unknown): string {
  if (error != null && typeof error === 'object') {
    const code = (error as Record<string, unknown>).code;
    if (typeof code === 'string' && API_ERROR_MESSAGES[code]) {
      return API_ERROR_MESSAGES[code];
    }
  }
  return GENERIC_ERROR;
}
