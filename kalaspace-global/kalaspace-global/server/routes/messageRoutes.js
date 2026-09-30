const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { listPeople, listMessages, sendMessage } = require('../controllers/messageController');

const router = express.Router();
router.use(requireAuth);
router.get('/people', listPeople);
router.get('/:userId', listMessages);
router.post('/:userId', sendMessage);
module.exports = router;