import 'dotenv/config';
import mongoose from 'mongoose';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import Property from '../models/Property.js';
import connect from '../config/dbConnection.js';
import { deleteImageByPublicId } from '../utils/cloudinary.js';

const RESEED = process.argv.includes('--reseed');

if (process.env.NODE_ENV === 'production') {
  console.error('❌ Property seed must not run in production.');
  process.exit(1);
}

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL_DEV;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD_DEV;
const API_KEY        = process.env.FIREBASE_WEB_API_KEY;
const PORT           = process.env.PORT_DEV || 3000;
const HOST           = process.env.HOST_DEV || '127.0.0.1';
const BASE_URL       = `http://${HOST}:${PORT}`;

const missing = [];
if (!ADMIN_EMAIL)    missing.push('ADMIN_EMAIL_DEV');
if (!ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD_DEV');
if (!API_KEY)        missing.push('FIREBASE_WEB_API_KEY');

if (missing.length) {
  console.error(`❌ Missing env variable(s): ${missing.join(', ')}`);
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_DIR  = join(__dirname, 'seedData');

const TWO_IMAGE_COUNT = 5;

const IMAGE_POOLS = {
  Apartment: [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  ],
  House: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  ],
  Villa: [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
  ],
};

async function prefetchImages() {
  const uniqueUrls = [...new Set(Object.values(IMAGE_POOLS).flat())];
  const cache = new Map();

  console.log(`Downloading ${uniqueUrls.length} property images from Unsplash...`);

  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${url} (${res.status})`);

    const arrayBuffer = await res.arrayBuffer();
    cache.set(url, Buffer.from(arrayBuffer));
    process.stdout.write(`  Downloaded ${i + 1}/${uniqueUrls.length}\r`);
  }

  console.log(`  Downloaded ${uniqueUrls.length}/${uniqueUrls.length} images.\n`);
  return cache;
}

function extractPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match ? match[1] : null;
}

async function clearProperties() {
  const properties = await Property.find({}, { images: 1 }).lean();
  const publicIds = properties
    .flatMap((p) => p.images || [])
    .map(extractPublicId)
    .filter(Boolean);

  if (publicIds.length > 0) {
    console.log(`Deleting ${publicIds.length} image(s) from Cloudinary...`);
    const results = await Promise.allSettled(
      publicIds.map((id) => deleteImageByPublicId(id)),
    );
    const deleted = results.filter((r) => r.status === 'fulfilled').length;
    const failed  = results.filter((r) => r.status === 'rejected').length;
    console.log(`  Cloudinary cleanup: ${deleted} deleted, ${failed} failed.`);
  }

  const { deletedCount } = await Property.deleteMany({});
  console.log(`Removed ${deletedCount} property document(s) from MongoDB.\n`);
}

async function getFirebaseIdToken() {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      returnSecureToken: true,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Firebase sign-in failed: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data.idToken;
}

async function getAuthCookie(idToken) {
  const res = await fetch(`${BASE_URL}/api/auth/firebase-exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Token exchange failed: ${err.error || res.statusText}`);
  }

  const setCookies = res.headers.getSetCookie?.() ?? [];
  const tokenCookie = setCookies.find((c) => c.startsWith('token='));

  if (!tokenCookie) {
    throw new Error('No token cookie received from firebase-exchange');
  }

  return tokenCookie.split(';')[0];
}

async function createPropertyViaApi(propertyData, imageBuffers, cookie) {
  const form = new FormData();

  for (const [key, value] of Object.entries(propertyData)) {
    form.append(key, String(value));
  }

  for (let i = 0; i < imageBuffers.length; i++) {
    form.append('images', new Blob([imageBuffers[i]], { type: 'image/jpeg' }), `image_${i}.jpg`);
  }

  const res = await fetch(`${BASE_URL}/api/property`, {
    method: 'POST',
    headers: { Cookie: cookie },
    body: form,
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error?.message || body.error || JSON.stringify(body));
  }

  return body.data;
}

async function seed() {
  console.log('🏠 Property Seed Script\n');

  console.log('Connecting to MongoDB to check existing properties...');
  await connect();
  const count = await Property.countDocuments();

  if (count > 0) {
    if (!RESEED) {
      console.log(`ℹ️  Properties collection already has ${count} document(s). Skipping seed.`);
      console.log('   Use --reseed (npm run seed:properties:reset) to clear and re-seed.');
      await mongoose.disconnect();
      return;
    }
    console.log(`Reseed mode: clearing ${count} existing property document(s)...`);
    await clearProperties();
  } else {
    console.log('Collection is empty. Proceeding with seed.\n');
  }

  await mongoose.disconnect();

  try {
    await fetch(`${BASE_URL}/api/property?limit=1`);
  } catch {
    console.error(`❌ Cannot reach dev server at ${BASE_URL}. Make sure it is running (npm run dev).`);
    process.exit(1);
  }

  console.log('Signing in to Firebase...');
  const idToken = await getFirebaseIdToken();
  console.log('✅ Firebase sign-in successful.');

  console.log('Exchanging token with backend...');
  const cookie = await getAuthCookie(idToken);
  console.log('✅ Admin auth cookie obtained.\n');

  const imageCache = await prefetchImages();

  const apartments = JSON.parse(await readFile(join(SEED_DIR, 'apartment.seed.json'), 'utf-8'));
  const houses     = JSON.parse(await readFile(join(SEED_DIR, 'house.seed.json'), 'utf-8'));
  const villas     = JSON.parse(await readFile(join(SEED_DIR, 'villa.seed.json'), 'utf-8'));
  const allProperties = [...apartments, ...houses, ...villas];

  console.log(
    `Loaded ${allProperties.length} properties ` +
    `(${apartments.length} apartments, ${houses.length} houses, ${villas.length} villas).\n`,
  );

  const typeCounters = { Apartment: 0, House: 0, Villa: 0 };
  let created = 0;
  let failed  = 0;

  for (let i = 0; i < allProperties.length; i++) {
    const property = { ...allProperties[i] };

    // Zod uses .positive() for landSize which rejects 0.
    // Apartments in seed data have landSize 0; clamp to 1 so validation passes.
    if (property.landSize <= 0) {
      property.landSize = 1;
    }

    const pool = IMAGE_POOLS[property.type] || IMAGE_POOLS.Apartment;
    const idx  = typeCounters[property.type] || 0;
    typeCounters[property.type] = idx + 1;

    const imageCount = i < TWO_IMAGE_COUNT ? 2 : 1;

    try {
      const imageBuffers = [];
      for (let v = 0; v < imageCount; v++) {
        const url = pool[(idx + v) % pool.length];
        imageBuffers.push(imageCache.get(url));
      }

      await createPropertyViaApi(property, imageBuffers, cookie);
      created++;
      console.log(
        `  [${String(i + 1).padStart(2)}/${allProperties.length}] ` +
        `✅ "${property.title}" (${imageCount} image${imageCount > 1 ? 's' : ''})`,
      );
    } catch (error) {
      failed++;
      console.log(
        `  [${String(i + 1).padStart(2)}/${allProperties.length}] ` +
        `❌ "${property.title}" — ${error.message}`,
      );
    }
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log('🎉 Property seed complete.');
  console.log(`   Created: ${created}`);
  console.log(`   Failed:  ${failed}`);
  console.log(`   Total:   ${allProperties.length}`);
}

seed().catch((err) => {
  console.error('❌ Property seed failed:', err.message);
  process.exitCode = 1;
});
