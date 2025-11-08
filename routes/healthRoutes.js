import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend service is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Protected health check endpoint (requires authentication)
router.get('/health/protected', verifyToken, (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend service is running with authentication',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    user: req.user ? { id: req.user.id, email: req.user.email, role: req.user.role } : null,
  });
});

export default router;