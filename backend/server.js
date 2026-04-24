const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./db');

const authRoutes = require('./routes/authRoutes');
const artworkRoutes = require('./routes/artworkRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ArtVault API is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Health:  http://localhost:${PORT}/api/health`);
  });
};

startServer();

