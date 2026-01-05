const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
  googleAuth,
  googleAuthCallback
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth');

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

// Protected Routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);


module.exports = router;