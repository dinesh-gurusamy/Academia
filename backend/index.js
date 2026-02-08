require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');

const app = express();

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

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/', (req, res) => {
  res.send('Local backend running 🚀');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () =>
      console.log('✅ Backend running on port 5000')
    );
  })
  .catch(console.error);
