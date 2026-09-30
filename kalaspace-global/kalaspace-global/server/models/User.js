const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'artist'], default: 'user' },
    name: { type: String, trim: true, default: '' },
    displayName: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);