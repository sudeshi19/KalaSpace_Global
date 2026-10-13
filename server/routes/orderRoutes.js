import express from 'express';
import { createOrder, getArtistOrders, getOrderById, getPayHereCheckout, payHereNotify, paySandboxOrder } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, createOrder);
router.get('/artist/mine', requireAuth, getArtistOrders);
router.get('/:id', requireAuth, getOrderById);
router.post('/:id/pay-sandbox', requireAuth, paySandboxOrder);
router.post('/:id/payhere', requireAuth, getPayHereCheckout);
router.post('/payhere/notify', payHereNotify);

export default router;