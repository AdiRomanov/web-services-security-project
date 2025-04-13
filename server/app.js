const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // sau '*' pentru dezvoltare
    credentials: true
  }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);

// Serve client pages
app.get('/auth/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/auth/index.html'));
});

app.get('/crud', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/crud/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;