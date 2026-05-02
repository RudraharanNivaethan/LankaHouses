import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getEnvSuffix } from '../utils/env.js';

const env = getEnvSuffix();
const serviceAccountPath = process.env[`FIREBASE_SERVICE_ACCOUNT_PATH_${env}`];
if (!serviceAccountPath) {
  throw new Error(`Missing FIREBASE_SERVICE_ACCOUNT_PATH_${env}. Check your .env file.`);
}
const resolved = resolve(process.cwd(), serviceAccountPath);
const serviceAccount = JSON.parse(readFileSync(resolved, 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;