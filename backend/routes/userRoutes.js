// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");

router.put("/update", userCtrl.updateUser);

module.exports = router;
