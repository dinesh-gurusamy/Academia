import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// IMPORTANT: Always include the .js extension for local file imports
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, role = 'student' } = req.body; // Default role set to lowercase 'student'

    // Validate role
    if (!['user', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch all users (Admin only)

router.get('/hi', async (req, res) => {
  try {
    console.log("Hi Machi...");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/users', authMiddleware.isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'username role'); // Only fetch username and role
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user role (Admin only)
router.put('/update-role/:userId', authMiddleware.isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;