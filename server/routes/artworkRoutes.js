import express from 'express';
import { getArtworks, getArtworkById } from '../controllers/artworkController.js';

const router = express.Router();

router.get('/', getArtworks);
router.get('/:id', getArtworkById);

export default router;