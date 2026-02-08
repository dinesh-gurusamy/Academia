const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('../routes/auth');
const resourceRoutes = require('../routes/resources');

const app = express();

/* ---------- CORS ---------- */
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://academia-1smr.vercel.app'
    ],
    credentials: true,
  })
);

app.use(express.json());

/* ---------- Routes ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/', (req, res) => {
  res.send('Backend API is running 🚀');
});

/* ---------- MongoDB (Vercel-safe) ---------- */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

connectDB().catch(err => {
  console.error('MongoDB error:', err);
});

/* ---------- Export ---------- */
module.exports = app;
