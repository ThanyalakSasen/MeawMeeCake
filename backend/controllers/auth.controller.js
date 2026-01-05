const User = require('../models/users');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const passport = require('passport');

// สร้าง JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// ส่ง token พร้อม cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.user_fullname,
      role: user.role,
      isVerified: user.isEmailVerified,
      phone: user.user_phone,
      birthDate: user.user_birthdate,
      allergies: user.user_allergies
    }
  });
};

// @desc    ลงทะเบียน
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { 
      user_fullname, 
      email, 
      password, 
      user_phone, 
      user_birthdate, 
      user_allergies 
    } = req.body;
    
    // Validation
    if (!user_fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
      });
    }
    
    // ตรวจสอบว่ามี email นี้แล้วหรือยัง
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'อีเมลนี้ถูกใช้งานแล้ว'
      });
    }
    
    // สร้าง user ใหม่
    const user = await User.create({
      user_fullname,
      email,
      password,
      user_phone,
      user_birthdate,
      user_allergies: user_allergies || [],
      authProvider: 'local',
      role: 'Customer',
      isEmailVerified: false
    });
    
    // สร้าง verification token
    const verificationToken = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });
    
    // ส่งอีเมลยืนยัน
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    const message = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; padding: 15px 30px; background-color: #f97316; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧁 ยินดีต้อนรับสู่ร้านเบเกอร์รี่!</h1>
          </div>
          <div class="content">
            <p>สวัสดีคุณ <strong>${user_fullname}</strong></p>
            <p>ขอบคุณที่สมัครสมาชิกกับเรา กรุณายืนยันอีเมลของคุณเพื่อเริ่มใช้งาน</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">✉️ ยืนยันอีเมล</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">ลิงก์นี้จะหมดอายุใน 24 ชั่วโมง</p>
            <p style="color: #6b7280; font-size: 14px;">หากคุณไม่ได้สมัครสมาชิก กรุณาเพิกเฉยอีเมลนี้</p>
          </div>
          <div class="footer">
            <p>© 2024 ร้านเบเกอร์รี่ของเรา</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: '✉️ ยืนยันอีเมลของคุณ - ร้านเบเกอร์รี่',
        html: message
      });
      
      res.status(201).json({
        success: true,
        message: 'ลงทะเบียนสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี',
        user: {
          id: user._id,
          email: user.email,
          name: user.user_fullname,
          isVerified: false
        }
      });
    } catch (err) {
      console.error('Email Error:', err);
      user.emailVerifyToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        success: false,
        message: 'ไม่สามารถส่งอีเมลยืนยันได้ กรุณาลองใหม่อีกครั้ง'
      });
    }
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
};

// @desc    เข้าสู่ระบบ
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  // เพิ่มบรรทัดนี้เพื่อบอก Browser ว่าห้ามจำผลลัพธ์การ Login นี้
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกอีเมลและรหัสผ่าน'
      });
    }
    
    // หา user และดึง password มาด้วย
    const user = await User.findOne({ email, isActive: true }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      });
    }
    
    // ตรวจสอบว่าเป็น local account หรือไม่
    if (user.authProvider !== 'local' || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'บัญชีนี้ลงทะเบียนผ่าน Google กรุณาใช้ Sign in with Google'
      });
    }
    
    // ตรวจสอบรหัสผ่าน
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      });
    }
    
    // เตือนถ้ายังไม่ verify email
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ',
        needVerification: true,
        email: user.email
      });
    }
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    });
  }
};

// @desc    ยืนยันอีเมล
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    // 1. รับ token จาก URL
    const rawToken = req.params.token;
    // 2. ทำ Hash เพื่อไปเทียบกับใน DB (ต้องทำเหมือนกับใน Model)
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const verificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    
    const user = await User.findOne({
      emailVerifyToken: verificationToken,
      verificationTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
     
      console.log("Verify Failed: Token invalid or expired", hashedToken);
      return res.status(400).json({
        success: false,
        message: 'ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุแล้ว'
      });
    }
    
    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.verificationTokenExpiry = undefined;
    
    // สำคัญ: ใส่ validateBeforeSave เพื่อไม่ให้กระทบ Password
    await user.save({ validateBeforeSave: false });
    
    // ส่ง success กลับไปให้ Frontend
    return res.status(200).json({
      success: true,
      message: 'ยืนยันอีเมลสำเร็จ!'
    });

  } catch (error) {
    console.error('Verify Email Error:', error);
    // ถ้า error ต้อง return 500
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการยืนยันอีเมล'
    });
  }
};

// @desc    ส่งอีเมลยืนยันใหม่
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email, isActive: true });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบอีเมลนี้ในระบบ'
      });
    }
    
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'อีเมลนี้ได้รับการยืนยันแล้ว'
      });
    }
    
    const verificationToken = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    const message = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>ยืนยันอีเมลของคุณ</h2>
          <p>สวัสดีคุณ ${user.user_fullname}</p>
          <p>กรุณาคลิกปุ่มด้านล่างเพื่อยืนยันอีเมลของคุณ:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">ยืนยันอีเมล</a>
          <p style="color: #666; font-size: 14px;">ลิงก์นี้จะหมดอายุใน 24 ชั่วโมง</p>
        </div>
      </body>
      </html>
    `;
    
    await sendEmail({
      email: user.email,
      subject: 'ยืนยันอีเมลของคุณ - ร้านเบเกอร์รี่',
      html: message
    });
    
    res.status(200).json({
      success: true,
      message: 'ส่งอีเมลยืนยันใหม่แล้ว กรุณาตรวจสอบอีเมลของคุณ'
    });
  } catch (error) {
    console.error('Resend Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งอีเมล'
    });
  }
};

// @desc    ขอรีเซ็ตรหัสผ่าน
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email, isActive: true });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบอีเมลนี้ในระบบ'
      });
    }
    
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: 'บัญชีนี้ลงทะเบียนผ่าน Google ไม่สามารถรีเซ็ตรหัสผ่านได้'
      });
    }
    
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const message = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>🔐 รีเซ็ตรหัสผ่าน</h2>
          <p>สวัสดีคุณ ${user.user_fullname}</p>
          <p>คุณได้ขอรีเซ็ตรหัสผ่าน กรุณาคลิกปุ่มด้านล่าง:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">รีเซ็ตรหัสผ่าน</a>
          <p style="color: #666; font-size: 14px;">ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</p>
          <p style="color: #999; font-size: 13px;">หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยอีเมลนี้</p>
        </div>
      </body>
      </html>
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: '🔐 รีเซ็ตรหัสผ่าน - ร้านเบเกอร์รี่',
        html: message
      });
      
      res.status(200).json({
        success: true,
        message: 'ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว'
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiry = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        success: false,
        message: 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้ง'
      });
    }
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  }
};

// @desc    รีเซ็ตรหัสผ่าน
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว'
      });
    }
    
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
      });
    }
    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'รีเซ็ตรหัสผ่านสำเร็จ! คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว'
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  }
};

// @desc    ข้อมูลผู้ใช้ปัจจุบัน
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.user_fullname,
        role: user.role,
        phone: user.user_phone,
        birthDate: user.user_birthdate,
        allergies: user.user_allergies,
        isVerified: user.isEmailVerified,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  }
};

// @desc    ออกจากระบบ
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: 'ออกจากระบบสำเร็จ'
  });
};

// @desc    Google OAuth
// @route   GET /api/auth/google
// @access  Public
exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// @desc    Google OAuth Callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
    
    // *** เพิ่มการตรวจสอบการยืนยันอีเมลตรงนี้ ***
    if (!user.isEmailVerified) {
      // ดีดไปหน้า verify-email (แบบไม่มี token) เพื่อให้แสดงหน้า "กรุณาเช็คเมล"
      return res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=info`);
    }
    // ถ้า verify แล้ว ถึงจะสร้าง token ให้เข้าสู่ระบบได้
    const token = generateToken(user._id);
    
    // Redirect พร้อม token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  })(req, res, next);
};