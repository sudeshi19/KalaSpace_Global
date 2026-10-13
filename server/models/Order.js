import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    artworkId: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    artistName: { type: String, trim: true },
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
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
    total: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    paymentMethod: { type: String, default: 'PayHere Sandbox' },
    paidAt: { type: Date },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model('Order', orderSchema);