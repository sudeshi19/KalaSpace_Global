import Artwork from '../models/Artwork.js';

// POST /api/artworks
export const createArtwork = async (req, res) => {
  try {
    const { title, category, imageUrl, price, color, description, stock = 1 } = req.body;
    if (!title || !category || !imageUrl || !price || !color || !description) {
      return res.status(400).json({ message: 'Title, category, image, price, color, and description are required' });
    }

    const artwork = await Artwork.create({
      title,
      category,
      imageUrl,
      price: Number(price),
      color,
      description,
      artistName: req.user.displayName || req.user.name || req.user.email,
      owner: req.user._id,
      stock: Math.max(0, Number.parseInt(stock, 10) || 0),
    });

    res.status(201).json(artwork);
  } catch (err) {
    res.status(400).json({ message: 'Failed to save artwork', error: err.message });
  }
};

// GET /api/artworks?category=paintings&q=sunset
export const getArtworks = async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { artistName: { $regex: q, $options: 'i' } },
      ];
    }

    const artworks = await Artwork.find(filter).sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load artworks', error: err.message });
  }
};

// GET /api/artworks/mine
export const getMyArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load your artworks', error: err.message });
  }
};

// DELETE /api/artworks/:id
export const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!artwork) return res.status(404).json({ message: 'Artwork not found or you do not own it' });
    res.json({ message: 'Artwork deleted successfully', id: artwork._id });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid artwork id' });
    res.status(500).json({ message: 'Failed to delete artwork', error: err.message });
  }
};

// GET /api/artworks/:id
export const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });
    res.json(artwork);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load artwork', error: err.message });
  }
};