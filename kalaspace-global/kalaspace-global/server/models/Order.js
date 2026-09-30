const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    artworkId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
    total: { type: Number, required: true, min: 0 },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);