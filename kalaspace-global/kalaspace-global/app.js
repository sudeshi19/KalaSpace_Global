const express = require('express');
const mongoose = require('mongoose');

const app = express();

// MongoDB Atlas Driver version 2.2.12 string එකක් භාවිතා කිරීම
const dbURI = 'mongodb://127.0.0.1:27017/kalaspace_db';


// Connect to MongoDB Database
mongoose.connect(dbURI)
  .then(() => {
    console.log('Successfully connected to MongoDB database! 🎉');
    
    // Start the server only after a successful database connection
    app.listen(3000, () => {
      console.log('Server is running on port 3000...');
    });
  })
  .catch((err) => {
    console.error('Database connection error: ❌', err);
  });
