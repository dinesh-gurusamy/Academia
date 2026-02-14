import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js'; 
import resourceRoutes from './routes/resources.js';

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
  res.send('Vercel backend running with JavaScript 🚀');
});

/* MongoDB – serverless safe connection */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection ♻️");
    return cached.conn;
  }
  
  if (!process.env.MONGO_URI) {
    console.error("❌ Error: Missing MONGO_URI in environment variables");
    return;
  }

  console.log("Connecting to MongoDB... ⏳");

  try {
    cached.promise = mongoose.connect(process.env.MONGO_URI);
    cached.conn = await cached.promise;
    
    console.log("✅ MongoDB Connected Successfully!");
    return cached.conn;
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    throw err;
  }
}

// Invoke connection
connectDB();

export default app;