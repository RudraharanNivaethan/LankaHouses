import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

function isFirebaseConfigured(): boolean {
  const key = typeof firebaseConfig.apiKey === 'string' ? firebaseConfig.apiKey.trim() : ''
  const projectId =
    typeof firebaseConfig.projectId === 'string' ? firebaseConfig.projectId.trim() : ''
  return Boolean(key && projectId)
}

/** Shown when env is missing or `getAuth` fails (e.g. invalid API key). */
export const FIREBASE_AUTH_UNAVAILABLE =
  'Sign-in is unavailable. In the project root `.env` (or `frontend/.env`), set `VITE_FIREBASE_*` or the aliases `FIREBASE_WEB_API_KEY` + `FIREBASE_PROJECT_ID` (+ other Web app fields from Firebase Console → Project settings → Your apps). Restart Vite.'

let firebaseAuth: Auth | null = null

if (isFirebaseConfigured()) {
  try {
    const app = initializeApp({
      apiKey: firebaseConfig.apiKey!,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId,
    })
    firebaseAuth = getAuth(app)
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[firebase] Initialization failed:', e)
    }
    firebaseAuth = null
  }
}

export { firebaseAuth }
