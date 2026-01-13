const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ตรวจสอบว่าใน auth.controller.js มีการ exports.verifyEmail หรือไม่
router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router;