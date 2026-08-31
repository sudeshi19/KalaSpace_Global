const express = require('express');
const router = express.Router();
const { getArtworks, getArtworkById } = require('../controllers/artworkController');

router.get('/', getArtworks);
router.get('/:id', getArtworkById);

module.exports = router;
