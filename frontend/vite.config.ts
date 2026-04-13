import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

/** Map backend-style / short Firebase env names into VITE_* (only when VITE_* is unset or blank). */
function applyFirebaseEnvBridge(merged: Record<string, string>, full: Record<string, string>) {
  const pick = (viteKey: string, ...fallbackKeys: string[]) => {
    const cur = merged[viteKey]?.trim()
    if (cur) return
    for (const k of fallbackKeys) {
      const v = full[k]?.trim()
      if (v) {
        merged[viteKey] = v
        return
      }
    }
  }

  pick('VITE_FIREBASE_API_KEY', 'FIREBASE_WEB_API_KEY')
  pick('VITE_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN')
  pick('VITE_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID')
  pick('VITE_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET')
  pick('VITE_FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_MESSAGING_SENDER_ID')
  pick('VITE_FIREBASE_APP_ID', 'FIREBASE_APP_ID')
}

/** Typical Firebase Hosting defaults when only `projectId` is set. */
function applyFirebaseDefaults(merged: Record<string, string>) {
  let pid = merged.VITE_FIREBASE_PROJECT_ID?.trim()
  if (!pid && merged.VITE_FIREBASE_AUTH_DOMAIN) {
    const m = merged.VITE_FIREBASE_AUTH_DOMAIN.trim().match(/^([^.]+)\.firebaseapp\.com$/)
    if (m) pid = m[1]
  }
  if (!pid) return

  if (!merged.VITE_FIREBASE_PROJECT_ID?.trim()) merged.VITE_FIREBASE_PROJECT_ID = pid
  if (!merged.VITE_FIREBASE_AUTH_DOMAIN?.trim()) merged.VITE_FIREBASE_AUTH_DOMAIN = `${pid}.firebaseapp.com`
  if (!merged.VITE_FIREBASE_STORAGE_BUCKET?.trim()) merged.VITE_FIREBASE_STORAGE_BUCKET = `${pid}.appspot.com`
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const merged: Record<string, string> = {
    ...loadEnv(mode, repoRoot, 'VITE_'),
    ...loadEnv(mode, __dirname, 'VITE_'),
  }

  const full = {
    ...loadEnv(mode, repoRoot, ''),
    ...loadEnv(mode, __dirname, ''),
  }

  applyFirebaseEnvBridge(merged, full)
  applyFirebaseDefaults(merged)

  const define: Record<string, string> = {}
  for (const [key, value] of Object.entries(merged)) {
    define[`import.meta.env.${key}`] = JSON.stringify(value)
  }

  return {
    envDir: false,
    define,
    plugins: [
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
      },
    },
  }
})
