import nodemailer from 'nodemailer';
import crypto from 'node:crypto';
import Artwork from '../models/Artwork.js';
import Order from '../models/Order.js';

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
};

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const email = req.user.email;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'A valid email and at least one item are required' });
    }

    const artworkIds = items.map((item) => String(item.artworkId));
    const artworks = await Artwork.find({ _id: { $in: artworkIds } }).lean();
    const artworkById = new Map(artworks.map((artwork) => [String(artwork._id), artwork]));
    const normalizedItems = items.map((item) => {
      const artwork = artworkById.get(String(item.artworkId));
      if (!artwork) throw new Error(`Artwork ${item.artworkId} is no longer available`);
      const quantity = Math.max(1, Number.parseInt(item.quantity, 10));
      if (artwork.stock < quantity) throw new Error(`${artwork.title} does not have enough stock`);
      return {
        artworkId: String(artwork._id),
        owner: artwork.owner,
        artistName: artwork.artistName,
        title: artwork.title,
        imageUrl: artwork.imageUrl,
        price: artwork.price,
        quantity,
      };
    });
    const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 20000 ? 0 : 1500;
    const total = subtotal + shipping;
    const order = await Order.create({
      email,
      buyer: req.user._id,
      items: normalizedItems,
      total,
      paymentStatus: 'Pending',
      paymentMethod: 'PayHere Sandbox',
    });
    await Promise.all(normalizedItems.map((item) => Artwork.updateOne(
      { _id: item.artworkId },
      { $inc: { soldCount: item.quantity, stock: -item.quantity } },
    )));
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

export const getArtistOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.owner': req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    const artistOrders = orders.map((order) => ({
      id: order._id,
      date: order.createdAt,
      buyerEmail: order.email,
      items: order.items.filter((item) => String(item.owner) === String(req.user._id)),
    })).filter((order) => order.items.length > 0);
    res.json(artistOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load artist orders', error: error.message });
  }
};

export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      buyer: {
        id: req.user._id,
        name: req.user.displayName || req.user.name || 'KalaSpace member',
        email: req.user.email,
        role: req.user.role,
        joinedAt: req.user.createdAt,
      },
      orders: orders.map((order) => ({
        id: order._id,
        date: order.createdAt,
        total: order.total,
        paymentStatus: order.paymentStatus || 'Pending',
        status: order.paymentStatus === 'Paid' ? 'Processing' : 'Awaiting payment',
        items: Array.isArray(order.items) ? order.items : [],
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load buyer orders', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user._id,
    }).lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      order: {
        id: order._id,
        createdAt: order.createdAt,
        email: order.email,
        total: order.total,
        paymentStatus: order.paymentStatus,
        status: order.paymentStatus === 'Paid' ? 'Processing' : 'Awaiting payment',
      },
      items: order.items,
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid order reference' });
  }
};

const SANDBOX_CARDS = new Set([
  '4916217501611292',
  '5307732125531191',
  '346781005510225',
]);

const payHereHash = (merchantId, orderId, amount, currency, secret) => {
  const secretHash = crypto.createHash('md5').update(secret).digest('hex').toUpperCase();
  return crypto.createHash('md5')
    .update(`${merchantId}${orderId}${amount}${currency}${secretHash}`)
    .digest('hex')
    .toUpperCase();
};

export const getPayHereCheckout = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, buyer: req.user._id }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!process.env.PAYHERE_MERCHANT_ID || !process.env.PAYHERE_MERCHANT_SECRET) {
      return res.status(503).json({ message: 'PayHere sandbox is not configured on the server' });
    }

    const amount = Number(order.total).toFixed(2);
    const currency = 'LKR';
    const nameParts = String(req.user.displayName || req.user.name || 'KalaSpace Buyer').trim().split(/\s+/);
    const payload = {
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      return_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}?payment=success&orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}?payment=cancel&orderId=${order._id}`,
      notify_url: process.env.PAYHERE_NOTIFY_URL || '',
      order_id: String(order._id),
      items: order.items.map((item) => `${item.title} x ${item.quantity}`).join(', '),
      amount,
      currency,
      first_name: nameParts[0] || 'KalaSpace',
      last_name: nameParts.slice(1).join(' ') || 'Buyer',
      email: req.user.email,
      phone: '0000000000',
      address: 'KalaSpace delivery address',
      city: 'Colombo',
      country: 'Sri Lanka',
      hash: payHereHash(process.env.PAYHERE_MERCHANT_ID, order._id, amount, currency, process.env.PAYHERE_MERCHANT_SECRET),
    };

    res.json({ checkoutUrl: 'https://sandbox.payhere.lk/pay/checkout', payload });
  } catch (error) {
    res.status(400).json({ message: 'Unable to start PayHere checkout', error: error.message });
  }
};

export const payHereNotify = async (req, res) => {
  try {
    const { merchant_id: merchantId, order_id: orderId, payhere_amount: amount, payhere_currency: currency, status_code: statusCode, md5sig } = req.body;
    const expected = crypto.createHash('md5')
      .update(`${merchantId}${orderId}${amount}${currency}${statusCode}${process.env.PAYHERE_MERCHANT_SECRET}`)
      .digest('hex')
      .toUpperCase();
    if (!md5sig || md5sig.toUpperCase() !== expected || merchantId !== process.env.PAYHERE_MERCHANT_ID) {
      return res.status(400).send('Invalid PayHere notification');
    }
    await Order.updateOne(
      { _id: orderId },
      { $set: { paymentStatus: String(statusCode) === '2' ? 'Paid' : 'Failed', paidAt: String(statusCode) === '2' ? new Date() : undefined } },
    );
    res.send('OK');
  } catch (error) {
    res.status(400).send('Invalid PayHere notification');
  }
};

export const paySandboxOrder = async (req, res) => {
  try {
    const { cardNumber, expiry, cvv, cardholderName } = req.body;
    const normalizedCard = String(cardNumber || '').replace(/\s/g, '');

    if (!cardholderName || !expiry || !/^\d{3,4}$/.test(String(cvv || ''))) {
      return res.status(400).json({ message: 'Enter the cardholder name, expiry, and a valid CVV.' });
    }

    if (!SANDBOX_CARDS.has(normalizedCard)) {
      return res.status(400).json({ message: 'Sandbox payment declined. Use one of the listed test card numbers.' });
    }

    const order = await Order.findOne({ _id: req.params.id, buyer: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus === 'Paid') {
      return res.json({ message: 'This order is already paid.', orderId: order._id, paymentStatus: order.paymentStatus });
    }

    order.paymentStatus = 'Paid';
    order.paidAt = new Date();
    await order.save();

    res.json({
      message: 'Sandbox payment approved. No real money was charged.',
      orderId: order._id,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    res.status(400).json({ message: 'Unable to process sandbox payment', error: error.message });
  }
};