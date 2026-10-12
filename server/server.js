import dotenv from 'dotenv';
dotenv.config();

console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import artworkRoutes from './routes/artworkRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '8mb' }));

app.use('/api/artworks', artworkRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('KalaSpace Global API is running');
});

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(() => process.exitCode = 1);
  