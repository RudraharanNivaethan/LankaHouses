import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getEnvSuffix } from '../utils/env.js';

const env = getEnvSuffix();

// Prefer inline JSON (required on Railway/cloud where the filesystem is ephemeral).
// Fall back to a file path for local development.
let serviceAccount;
const inlineJson = process.env[`FIREBASE_SERVICE_ACCOUNT_JSON_${env}`];

if (inlineJson) {
  try {
    serviceAccount = JSON.parse(inlineJson);
  } catch {
    throw new Error(
      `FIREBASE_SERVICE_ACCOUNT_JSON_${env} is set but contains invalid JSON. Check your environment variables.`
    );
  }
} else {
  const serviceAccountPath = process.env[`FIREBASE_SERVICE_ACCOUNT_PATH_${env}`];
  if (!serviceAccountPath) {
    throw new Error(
      `Firebase service account not configured: set FIREBASE_SERVICE_ACCOUNT_JSON_${env} ` +
      `(inline JSON string) or FIREBASE_SERVICE_ACCOUNT_PATH_${env} (file path). ` +
      `Check your .env file.`
    );
  }
  const resolved = resolve(process.cwd(), serviceAccountPath);
  serviceAccount = JSON.parse(readFileSync(resolved, 'utf-8'));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;