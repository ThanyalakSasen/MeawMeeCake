// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');

// Middleware ตรวจสอบ authentication
exports.protect = async (req, res, next) => {
  let token;
  
  // ดึง token จาก header หรือ cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'กรุณาเข้าสู่ระบบ'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบผู้ใช้หรือบัญชีถูกระงับ'
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token ไม่ถูกต้อง'
    });
  }
};

// Middleware ตรวจสอบ authorization (บทบาท)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `บทบาท ${req.user.role} ไม่มีสิทธิ์เข้าถึงส่วนนี้`
      });
    }
    next();
  };
};