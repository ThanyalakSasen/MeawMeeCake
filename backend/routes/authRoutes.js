const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");

// 🔹 Google login (ใช้ POST ตามที่ React ส่งมา)
router.post("/google", authController.googleLogin);
// Local register & login
router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/test", (req, res) => {
  res.send("user route OK");
});

router.get("/profile", isAuthenticated, (req, res) => {
  res.json({ user: req.user }); // สำหรับ SPA (React) ควรส่งเป็น JSON
});


module.exports = router;