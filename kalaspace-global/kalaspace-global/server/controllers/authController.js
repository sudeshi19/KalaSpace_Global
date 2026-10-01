const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const issueToken = (user) => jwt.sign(
  { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
  process.env.JWT_SECRET || 'change-this-secret',
  { expiresIn: '7d' },
);

const responseFor = (user) => ({
  token: issueToken(user),
  user: { id: user._id, email: user.email, role: user.role, name: user.name },
});

exports.register = async (req, res) => {
  try {
    const { email, password, role = 'user', name = '' } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedName = name.trim();
    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || !password || password.length < 6 || !normalizedName) {
      return res.status(400).json({ message: 'Name, email, and a password of at least 6 characters are required' });
    }
    if (!['user', 'artist'].includes(role)) return res.status(400).json({ message: 'New accounts can only be User or Artist accounts' });
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists' });
    const user = await User.create({ email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12), role, name: normalizedName });
    res.status(201).json(responseFor(user));
  } catch (error) {
    res.status(500).json({ message: 'Failed to create account', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect' });
    res.json(responseFor(user));
  } catch (error) {
    res.status(500).json({ message: 'Failed to sign in', error: error.message });
  }
};

exports.me = (req, res) => res.json({
  user: { id: req.user._id, email: req.user.email, role: req.user.role, name: req.user.name, displayName: req.user.displayName },
});