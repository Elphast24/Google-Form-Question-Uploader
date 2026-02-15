// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const formRoutes = require('./routes/forms');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ===========================
// Middleware
// ===========================
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================
// API ROUTES
// ===========================
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);     // ✔ FIXED — this route now exists
app.use('/api/forms', formRoutes);
app.use('/api/auth', authRoutes);

// ===========================
// Health Check
// ===========================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// ===========================
// Global Error Handler
// ===========================
app.use(errorHandler);

// ===========================
// Start Server
// ===========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
