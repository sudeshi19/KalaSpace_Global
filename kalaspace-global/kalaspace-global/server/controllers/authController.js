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
    if (!email || !/^\S+@\S+\.\S+$/.test(email) || !password || password.length < 6) {
      return res.status(400).json({ message: 'Email and a password of at least 6 characters are required' });
    }
    if (!['admin', 'user', 'artist'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email already exists' });
    const user = await User.create({ email, passwordHash: await bcrypt.hash(password, 12), role, name });
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
  user: { id: req.user._id, email: req.user.email, role: req.user.role, name: req.user.name },
});