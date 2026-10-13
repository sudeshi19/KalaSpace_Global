import express from 'express';
import { createArtwork, deleteArtwork, getArtworks, getArtworkById, getMyArtworks, updateArtworkStock } from '../controllers/artworkController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, createArtwork);
router.get('/mine', requireAuth, getMyArtworks);
router.delete('/:id', requireAuth, deleteArtwork);
router.patch('/:id/stock', requireAuth, updateArtworkStock);
router.get('/', getArtworks);
router.get('/:id', getArtworkById);

export default router;