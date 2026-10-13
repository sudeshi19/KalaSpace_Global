import express from 'express';
import { deleteAdminArtwork, getAdminSummary, updateAdminStock } from '../controllers/adminController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', requireAuth, getAdminSummary);
router.delete('/artworks/:id', requireAuth, deleteAdminArtwork);
router.patch('/artworks/:id/stock', requireAuth, updateAdminStock);

export default router;
