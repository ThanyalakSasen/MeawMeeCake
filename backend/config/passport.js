const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/usersModel');

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email: email.toLowerCase(),
          authProvider: 'local',
          isActive: true
        }).select('+password');

        if (!user) {
          return done(null, false, {
            message: 'อีเมลนี้ไม่ได้สมัครด้วยระบบ Local'
          });
        }

        if (!user.isEmailVerified) {
          return done(null, false, {
            message: 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ'
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);


// Google Strategy
// ใน passport.js หรือ googleStrategy.js
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("✅ GOOGLE PROFILE:", profile.id, profile.emails[0].value);
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          console.log("🆕 CREATE GOOGLE USER");
          // 🔴 สร้าง user ใหม่
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            user_fullname: profile.displayName,
            authProvider: 'google',
            role: 'Customer',
            isEmailVerified: true,      // ✅ Google verify แล้ว
            profileCompleted: false,    // ✅ ยังไม่ได้กรอกข้อมูล
            user_img: profile.photos?.[0]?.value || null,
            isActive: true
          });
          
          console.log('✅ Created new Google user:', user.email);
        }

        return done(null, user);
      } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, null);
      }
    }
  )
);





module.exports = passport;