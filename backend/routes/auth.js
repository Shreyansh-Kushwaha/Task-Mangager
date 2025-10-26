import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';

dotenv.config();
const router = express.Router();

// @route   POST /api/auth/register , public access
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ email, password, role });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/auth/login , public access
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/auth/protected , private access
router.get('/protected', protect, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, you are authorized!` });
});

// admin
router.get('/admin-only', protect, admin, (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

export default router;
