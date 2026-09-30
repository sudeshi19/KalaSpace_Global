const Message = require('../models/Message');
const User = require('../models/User');

exports.listPeople = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('-passwordHash').sort({ displayName: 1, email: 1 });
  res.json({ users });
};

exports.listMessages = async (req, res) => {
  const { userId } = req.params;
  const messages = await Message.find({ $or: [{ sender: req.user._id, recipient: userId }, { sender: userId, recipient: req.user._id }] }).sort({ createdAt: 1 }).populate('sender recipient', 'email displayName role');
  await Message.updateMany({ sender: userId, recipient: req.user._id, readAt: null }, { readAt: new Date() });
  res.json({ messages });
};

exports.sendMessage = async (req, res) => {
  const content = req.body.content?.trim();
  if (!content) return res.status(400).json({ message: 'Message cannot be empty' });
  const recipient = await User.findById(req.params.userId);
  if (!recipient) return res.status(404).json({ message: 'Recipient not found' });
  const message = await Message.create({ sender: req.user._id, recipient: recipient._id, content });
  await message.populate('sender recipient', 'email displayName role');
  res.status(201).json({ message });
};