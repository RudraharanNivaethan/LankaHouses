import mongoose from 'mongoose';
// [OLD CODE] import { hashPassword } from '../utils/passwordUtils.js';

const userSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    email:         { type: String, required: true, unique: true },
    phone:         { type: String },
    password:      { type: String, select: false },
    firebase_uid:  { type: String, sparse: true, unique: true },
    role:          { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user', immutable: true },
    // [OLD CODE] loginAttempts: { type: Number, default: 0 },
    // [OLD CODE] lockUntil:     { type: Date },
    tokenVersion:  { type: Number, default: 0 }
  },
  { timestamps: true }
);

// [OLD CODE] Pre-save hook for classic password hashing — Firebase owns passwords now.
// userSchema.pre('save', async function () {
//   if (!this.isModified('password') || !this.password) return;
//   this.password = await hashPassword(this.password);
// });

const User = mongoose.model('User', userSchema);

export default User;
