/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY_DEV?: string;
  readonly VITE_FIREBASE_API_KEY_PROD?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN_DEV?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN_PROD?: string;
  readonly VITE_FIREBASE_PROJECT_ID_DEV?: string;
  readonly VITE_FIREBASE_PROJECT_ID_PROD?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET_DEV?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET_PROD?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID_DEV?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID_PROD?: string;
  readonly VITE_FIREBASE_APP_ID_DEV?: string;
  readonly VITE_FIREBASE_APP_ID_PROD?: string;
  readonly VITE_SEARCH_DEBOUNCE_MS_DEV?: string;
  readonly VITE_SEARCH_DEBOUNCE_MS_PROD?: string;
}
