const multer = require("multer");
const path = require("path");
const fs = require("fs");

// สร้างโฟลเดอร์สำหรับเก็บรูปภาพถ้ายังไม่มี
const uploadDir = path.join(__dirname, "../uploads/users");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// กำหนดการจัดเก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // สร้างชื่อไฟล์ไม่ซ้ำกัน: timestamp + random + extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "user-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// กรองไฟล์ให้เป็นรูปภาพเท่านั้น
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น (jpg, jpeg, png, gif, webp)"));
  }
};

// สร้าง multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // จำกัดขนาดไฟล์ 5MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;
