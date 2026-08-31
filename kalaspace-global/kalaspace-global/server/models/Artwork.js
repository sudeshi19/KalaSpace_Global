const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artistName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['paintings', 'photography', 'sculptures'],
      required: true,
    },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artwork', artworkSchema);
