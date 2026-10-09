import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listPeople, listMessages, sendMessage } from '../controllers/messageController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/people', listPeople);
router.get('/:userId', listMessages);
router.post('/:userId', sendMessage);

export default router;