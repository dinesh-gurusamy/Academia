require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://academia-1smr.vercel.app',
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/', (req, res) => {
  res.send('Academia Backend is Live 🚀');
});

// MongoDB Connection (Vercel best practice: connect outside the handler)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// REQUIRED FOR VERCEL: Export the app instance
module.exports = app;