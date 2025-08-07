const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Resume Roaster API is running!' });
});

// Import and use route handlers
const roastRoutes = require('./routes/roast');
app.use('/api/roast', roastRoutes);

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Max size is 5MB.' });
  }
  
  if (error.message === 'Only PDF files are allowed!') {
    return res.status(400).json({ error: 'Only PDF files are allowed!' });
  }
  
  res.status(500).json({ error: error.message || 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🔥 Resume Roaster server is running on port ${PORT}`);
  console.log(`📝 Make sure to set your GROQ_API_KEY in .env file`);
  console.log(`🌐 API Health Check: http://localhost:${PORT}/api/roast/health`);
});