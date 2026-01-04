const nodemailer = require('nodemailer');

const sendVerifyEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const verifyUrl = `http://localhost:3000/api/email/verify-email/${token}`;

    await transporter.sendMail({
      from: `"Meawmee Cake" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'ยืนยันอีเมลของคุณ - Meawmee Cake',
      html: `
        <div style="font-family: sans-serif;">
          <h3>ยืนยันอีเมลของคุณ</h3>
          <p>กรุณาคลิกปุ่มด้านล่างเพื่อยืนยันอีเมลและเปิดใช้งานบัญชี</p>
          <a href="${verifyUrl}" style="padding:10px 20px; background:#f39c12; color:white; text-decoration:none; border-radius:5px;">ยืนยันอีเมล</a>
        </div>
      `
    });
    console.log(`✅ Verification email sent to ${email}`);
  } catch (err) {
    console.error('❌ Error sending verification email:', err);
  }
};

module.exports = sendVerifyEmail;