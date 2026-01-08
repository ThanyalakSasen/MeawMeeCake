// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendVerifyEmail = async (options) => {
  // สร้าง transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // 'gmail'
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Gmail App Password
    }
  });
  
  // ตั้งค่าอีเมล
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.html
  };
  
  // ส่งอีเมล
  await transporter.sendMail(mailOptions);
};

module.exports = sendVerifyEmail;