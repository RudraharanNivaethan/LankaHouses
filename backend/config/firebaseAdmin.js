import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Firebase JSON uses "\n" in the string; some editors/copy-paste leave literal \n
 * as two characters — normalize so PEM parses correctly.
 */
function normalizePrivateKey(privateKey) {
  if (typeof privateKey !== 'string') return privateKey;
  return privateKey.replace(/\\n/g, '\n').trim();
}

function tryInitialize() {
  const rel = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (!rel) {
    console.warn(
      '[firebase-admin] FIREBASE_SERVICE_ACCOUNT_PATH is not set — set it in backend/.env to enable Firebase token verification.'
    );
    return;
  }

  const serviceAccountPath = resolve(process.cwd(), rel);
  if (!existsSync(serviceAccountPath)) {
    console.warn(`[firebase-admin] Service account file not found: ${serviceAccountPath}`);
    return;
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
  } catch (e) {
    console.warn('[firebase-admin] Could not parse service account JSON:', e.message);
    return;
  }

  if (typeof serviceAccount.private_key === 'string') {
    serviceAccount.private_key = normalizePrivateKey(serviceAccount.private_key);
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    console.log('✅ Firebase Admin initialized');
  } catch (e) {
    console.warn('[firebase-admin] Failed to initialize:', e.message);
    console.warn(
      '[firebase-admin] Use a valid JSON key: Firebase Console → Project settings → Service accounts → Generate new private key. Do not edit the private_key string.'
    );
  }
}

tryInitialize();

export function isFirebaseAdminReady() {
  return admin.apps.length > 0;
}

/**
 * @throws {Error} code `FIREBASE_NOT_CONFIGURED` if Admin SDK did not start
 */
export async function verifyFirebaseIdToken(idToken) {
  if (!admin.apps.length) {
    const err = new Error('Firebase Admin is not initialized');
    err.code = 'FIREBASE_NOT_CONFIGURED';
    throw err;
  }
  return admin.auth().verifyIdToken(idToken);
}

export default admin;
