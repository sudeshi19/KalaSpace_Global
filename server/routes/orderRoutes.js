import express from 'express';
import { createOrder, getArtistOrders } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, createOrder);
router.get('/artist/mine', requireAuth, getArtistOrders);

export default router;