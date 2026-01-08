
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/usersModel');
const sendEmail = require('../utils/sendVerifyEmail');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        
        // ตรวจสอบว่ามี user ด้วย googleId หรือไม่
        let user = await User.findOne({ 
      $or: [{ googleId: profile.id }, { email: email }] 
    });
        
        if (user) {
          // ถ้ามีแล้ว return user
          return done(null, user);
        }
        
        // ตรวจสอบว่ามี email ซ้ำไหม
        user = await User.findOne({ email });
        
        if (user) {
          // ถ้ามี email แล้ว ให้ link Google account
          user.googleId = profile.id;
          user.isEmailVerified = true; // Google verified แล้ว
          if (!user.authProvider || user.authProvider === 'local') {
            user.authProvider = 'google';
          }
          await user.save();
          return done(null, user);
        }
        
        // สร้าง user ใหม่
        user = await User.create({
          googleId: profile.id,
          email,
          user_fullname: profile.displayName,
          authProvider: 'google',
          role: 'Customer',
          isEmailVerified: false,// Google verified แล้ว
          user_img: profile.photos[0]?.value,
          profileCompleted: false
        });
        
        const verificationToken = user.createVerificationToken();
        await user.save({ validateBeforeSave: false });

    // ส่งอีเมลยืนยัน (ยก Logic จาก register มาใช้)
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const htmlMessage = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="text-align: center; color: #FBBC05;">🍰 ยืนยันการลงทะเบียนด้วย Google</h2>
            <p>สวัสดีคุณ <strong>${user.user_fullname}</strong>,</p>
            <p>คุณได้ทำการลงทะเบียนผ่าน Google เพื่อเริ่มใช้งานกรุณายืนยันอีเมลโดยคลิกปุ่มด้านล่างนี้:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #FBBC05; color: black; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">ยืนยันอีเมลของฉัน</a>
            </div>
            <p style="color: #666; font-size: 12px;">ลิงก์นี้มีอายุการใช้งาน 24 ชั่วโมง</p>
          </div>
        `;

        // 6. ส่งอีเมล
        await sendEmail({
          email: user.email,
          subject: '✉️ ยืนยันอีเมลของคุณ (Google Registration)',
          html: htmlMessage
        });

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;