const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.get("/verify-email/:token", authCtrl.verifyEmail);
router.post("/resend-verification", authCtrl.resendVerification);

router.post("/forgot-password", authCtrl.forgotPassword);
router.get("/verify-reset-token/:token", authCtrl.verifyResetToken);
router.post("/reset-password/:token", authCtrl.resetPassword);

// Google OAuth
router.get("/google", authCtrl.googleAuth);
router.get("/google/callback", authCtrl.googleAuthCallback);

// Protected
router.get("/me", protect, authCtrl.getMe);
router.post("/logout", protect, authCtrl.logout);


//Profile management (Protected)
router.put('/complete-profile', protect, authCtrl.completeProfile);  // ✅ กรอกข้อมูลครั้งแรก
router.put('/update-profile', protect, authCtrl.updateProfile);      // ✅ แก้ไขข้อมูลภายหลัง

module.exports = router;