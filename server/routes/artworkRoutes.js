import express from 'express';
import { createArtwork, deleteArtwork, getArtworks, getArtworkById, getMyArtworks } from '../controllers/artworkController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, createArtwork);
router.get('/mine', requireAuth, getMyArtworks);
router.delete('/:id', requireAuth, deleteArtwork);
router.get('/', getArtworks);
router.get('/:id', getArtworkById);

export default router;