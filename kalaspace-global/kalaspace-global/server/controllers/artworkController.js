const Artwork = require('../models/Artwork');

// GET /api/artworks?category=paintings&q=sunset
exports.getArtworks = async (req, res) => {
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

// GET /api/artworks/:id
exports.getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });
    res.json(artwork);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load artwork', error: err.message });
  }
};
