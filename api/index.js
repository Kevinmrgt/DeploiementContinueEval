require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const sensorRoutes = require('./routes/sensorRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/sensors', sensorRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Root endpoint with API info
app.get('/', (req, res) => {
  res.json({
    name: 'IoT Sensors API',
    version: '1.0.0',
    description: 'API for environmental IoT sensors',
    endpoints: [
      { path: '/api/sensors', description: 'Sensor data operations' },
      { path: '/health', description: 'API health check' }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app; // For testing
