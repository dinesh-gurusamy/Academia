const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('../routes/auth');
const resourceRoutes = require('../routes/resources');

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://academia-six-iota.vercel.app',
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/', (req, res) => {
  res.send('Vercel backend running 🚀');
});

/* MongoDB – serverless safe */
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.promise = mongoose.connect(process.env.MONGO_URI);
  cached.conn = await cached.promise;
}

connectDB().catch(console.error);

/* 🔑 THIS LINE IS MANDATORY */
module.exports = app;
