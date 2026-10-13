import Artwork from '../models/Artwork.js';
import Order from '../models/Order.js';

export const getAdminSummary = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    const [artworks, orders] = await Promise.all([
      Artwork.find({}).sort({ createdAt: -1 }).lean(),
      Order.find({}).sort({ createdAt: -1 }).lean(),
    ]);

    const products = artworks.map((artwork) => ({
      id: artwork._id,
      title: artwork.title,
      category: artwork.category,
      price: artwork.price,
      stock: artwork.stock || 0,
      sold: artwork.soldCount || 0,
      imageUrl: artwork.imageUrl,
      artistName: artwork.artistName,
      createdAt: artwork.createdAt,
    }));

    const normalizedOrders = orders.map((order) => ({
      id: order._id,
      buyer: order.email,
      date: order.createdAt,
      status: 'Paid',
      total: order.total,
      items: order.items.reduce((count, item) => count + item.quantity, 0),
    }));

    const revenue = orders.reduce((total, order) => total + Number(order.total || 0), 0);
    res.json({
      products,
      orders: normalizedOrders,
      stats: {
        revenue,
        orders: orders.length,
        activeProducts: products.length,
        lowStock: products.filter((product) => product.stock <= 5).length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load admin data', error: error.message });
  }
};

export const deleteAdminArtwork = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    const artwork = await Artwork.findByIdAndDelete(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });
    res.json({ message: 'Artwork deleted successfully', id: artwork._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete artwork', error: error.message });
  }
};

export const updateAdminStock = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    const amount = Number.parseInt(req.body.amount, 10);
    if (!Number.isFinite(amount) || amount < 0) return res.status(400).json({ message: 'A valid stock amount is required' });
    const artwork = await Artwork.findByIdAndUpdate(req.params.id, { $set: { stock: amount } }, { new: true });
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });
    res.json({ id: artwork._id, stock: artwork.stock });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update stock', error: error.message });
  }
};
