import express from 'express';
import { register, login, me, listUsers } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.get('/users', requireAuth, listUsers);

export default router;