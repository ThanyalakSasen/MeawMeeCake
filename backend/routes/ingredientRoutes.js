const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes - ไม่ต้อง login

// ดึงวัตถุดิบทั้งหมด (สำหรับแสดงตัวเลือกแพ้อาหาร)
router.get('/', ingredientController.getAllIngredients);

// ดึงวัตถุดิบที่พร้อมใช้งาน (สำหรับฟอร์มสมัครสมาชิก)
router.get('/available', ingredientController.getAvailableIngredients);

// ดึงวัตถุดิบที่เหลือน้อย
router.get('/low-stock/list', ingredientController.getLowStockIngredients);

// Protected routes - ต้อง login

// สร้างวัตถุดิบใหม่
router.post('/', protect, ingredientController.createIngredient);

// ดึงวัตถุดิบตาม ID
router.get('/:id', protect, ingredientController.getIngredientById);

// แก้ไขวัตถุดิบ
router.put('/:id', protect, ingredientController.updateIngredient);

// ลบวัตถุดิบ (soft delete)
router.delete('/:id', protect, ingredientController.sofeDeleteIngredient);

// ลบวัตถุดิบถาวร (hard delete)
router.delete('/hard-delete/:id', protect, ingredientController.hardDeleteIngredient);

// อัปเดตจำนวนสต็อก
router.patch('/:id/stock', protect, ingredientController.updateStockQuantity);

// กู้คืนวัตถุดิบ
router.patch('/:id/recovery', protect, ingredientController.recoveryIngredient);

module.exports = router;