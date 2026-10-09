import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import artworkRoutes from './routes/artworkRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kalaspace_db';

// Connect to MongoDB Database
mongoose.connect(dbURI)
  .then(() => {
    console.log('Successfully connected to MongoDB database! 🎉');
    
    // Start the server only after a successful database connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error('Database connection error: ❌', err);
  });