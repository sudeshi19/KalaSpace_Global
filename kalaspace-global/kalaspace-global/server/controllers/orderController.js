const nodemailer = require('nodemailer');
const Order = require('../models/Order');

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
};

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const email = req.user.email;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'A valid email and at least one item are required' });
    }

    const normalizedItems = items.map((item) => ({
      artworkId: String(item.artworkId),
      title: String(item.title).trim(),
      imageUrl: item.imageUrl,
      price: Number(item.price),
      quantity: Math.max(1, Number.parseInt(item.quantity, 10)),
    }));
    const total = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({ email, items: normalizedItems, total });
    const transporter = createTransporter();

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: `KalaSpace order confirmation #${order._id}`,
        text: `Thank you for your KalaSpace order. Order total: $${total.toFixed(2)}.`,
      });
      order.emailSent = true;
      await order.save();
    }

    res.status(201).json({
      message: transporter ? 'Order confirmed. A confirmation email was sent.' : 'Order recorded. Configure SMTP to send confirmation emails.',
      orderId: order._id,
      total,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};