import mongoose from 'mongoose';
import { hashPassword } from '../utils/passwordUtils.js';

const userSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    email:         { type: String, required: true, unique: true },
    phone:         { type: String, required: true },
    password:      { type: String, required: true, select: false },
    role:          { type: String, enum: ['user', 'admin'], default: 'user', immutable: true },
    loginAttempts: { type: Number, default: 0 },
    lockUntil:     { type: Date }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
