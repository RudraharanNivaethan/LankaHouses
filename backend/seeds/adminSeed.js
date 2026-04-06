import 'dotenv/config';
import mongoose from 'mongoose';
import admin from '../config/firebaseAdmin.js';
import User from '../models/User.js';
import connect from '../config/dbConnection.js';

if (process.env.NODE_ENV === 'production') {
  console.error('❌ Admin seed must not run in production.');
  process.exit(1);
}

const ADMIN_NAME     = process.env.ADMIN_FULLNAME_DEV;
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL_DEV;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD_DEV;

const missing = [];
if (!ADMIN_NAME)     missing.push('ADMIN_FULLNAME_DEV');
if (!ADMIN_EMAIL)    missing.push('ADMIN_EMAIL_DEV');
if (!ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD_DEV');

if (missing.length) {
  console.error(`❌ Missing env variable(s): ${missing.join(', ')}`);
  process.exit(1);
}

async function getOrCreateFirebaseUser() {
  try {
    const fbUser = await admin.auth().createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      displayName: ADMIN_NAME,
    });
    console.log(`✅ Firebase user created  (uid: ${fbUser.uid})`);
    return fbUser.uid;
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      const existing = await admin.auth().getUserByEmail(ADMIN_EMAIL);
      console.log(`ℹ️  Firebase user already exists (uid: ${existing.uid})`);
      return existing.uid;
    }
    throw err;
  }
}

async function getOrCreateMongoUser(firebaseUid) {
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    if (existing.firebase_uid === firebaseUid && existing.role === 'admin') {
      console.log('ℹ️  MongoDB admin document already seeded — nothing to do.');
      return existing;
    }

    if (!existing.firebase_uid) {
      existing.firebase_uid = firebaseUid;
      await existing.save();
      console.log('✅ Linked firebase_uid to existing MongoDB document.');
    }

    if (existing.role !== 'admin') {
      console.warn(
        '⚠️  MongoDB document exists but role is "%s". ' +
        'The role field is immutable — delete the document and re-run the seeder to fix this.',
        existing.role,
      );
    }

    return existing;
  }

  const user = await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    firebase_uid: firebaseUid,
    role: 'admin',
  });
  console.log(`✅ MongoDB admin document created (id: ${user._id})`);
  return user;
}

async function seed() {
  try {
    await connect();
    const firebaseUid = await getOrCreateFirebaseUser();
    await getOrCreateMongoUser(firebaseUid);
    console.log('\n🎉 Admin seed complete.');
  } catch (err) {
    console.error('❌ Admin seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
