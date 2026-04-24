import mongoose from 'mongoose';
import firebaseAdmin from '../../config/firebaseAdmin.js';
import User from '../../models/User.js';
import connect from '../../config/dbConnection.js';

/**
 * Creates a Firebase account for a privileged user (admin or superadmin),
 * or returns the existing UID if the email is already registered.
 */
export async function getOrCreateFirebaseUser({ name, email, password }) {
  try {
    const fbUser = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName: name,
    });
    console.log(`✅ Firebase user created  (uid: ${fbUser.uid})`);
    return fbUser.uid;
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      const existing = await firebaseAdmin.auth().getUserByEmail(email);
      console.log(`ℹ️  Firebase user already exists (uid: ${existing.uid})`);
      return existing.uid;
    }
    throw err;
  }
}

/**
 * Creates a MongoDB User document for a privileged user,
 * or verifies the existing document is already correctly seeded.
 * Warns (but does not throw) when the role field is wrong and immutable.
 */
export async function getOrCreateMongoUser({ firebaseUid, name, email, role }) {
  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.firebase_uid === firebaseUid && existing.role === role) {
      console.log(`ℹ️  MongoDB ${role} document already seeded — nothing to do.`);
      return existing;
    }

    if (!existing.firebase_uid) {
      existing.firebase_uid = firebaseUid;
      await existing.save();
      console.log('✅ Linked firebase_uid to existing MongoDB document.');
    }

    if (existing.role !== role) {
      console.warn(
        `⚠️  MongoDB document exists but role is "${existing.role}". ` +
        `The role field is immutable — delete the document and re-run the seeder to fix this.`,
      );
    }

    return existing;
  }

  const user = await User.create({
    name,
    email,
    firebase_uid: firebaseUid,
    role,
  });
  console.log(`✅ MongoDB ${role} document created (id: ${user._id})`);
  return user;
}

/**
 * Orchestrates full privileged-user seeding:
 * connects to MongoDB, creates/verifies the Firebase account and MongoDB
 * document, then disconnects. Safe to call multiple times (idempotent).
 *
 * @param {{ name: string, email: string, password: string, role: 'admin'|'superadmin' }} params
 */
export async function seedPrivilegedUser({ name, email, password, role }) {
  try {
    await connect();
    const firebaseUid = await getOrCreateFirebaseUser({ name, email, password });
    await getOrCreateMongoUser({ firebaseUid, name, email, role });
    console.log(`\n🎉 ${role} seed complete.`);
  } catch (err) {
    console.error(`❌ ${role} seed failed:`, err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
