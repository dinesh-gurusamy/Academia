import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

const authMiddleware = {
  // Verify token and set req.user
  verifyToken: (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' });
    }
  },

  // Check if authenticated
  isAuthenticated: (req, res, next) => {
    authMiddleware.verifyToken(req, res, () => {
      if (req.user) {
        next();
      } else {
        res.status(401).json({ message: 'Not authenticated' });
      }
    });
  },

  // Check if admin
  isAdmin: (req, res, next) => {
    authMiddleware.verifyToken(req, res, () => {
      if (req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ message: 'Admin access required' });
      }
    });
  },

  // Check if faculty or admin
  isFacultyOrAdmin: (req, res, next) => {
    authMiddleware.verifyToken(req, res, () => {
      if (['faculty', 'admin'].includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ message: 'Faculty or admin access required' });
      }
    });
  },
};

export default authMiddleware;