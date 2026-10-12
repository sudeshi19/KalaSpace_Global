import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
const name = process.env.ADMIN_NAME || 'KalaSpace Admin';

if (!email || !password) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be provided');
}

try {
  await connectDB();
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await User.findOneAndUpdate(
    { email },
    { $set: { email, passwordHash, role: 'admin', name, displayName: name } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  console.log(`Admin account provisioned: ${admin.email}`);
} finally {
  await mongoose.disconnect();
}
