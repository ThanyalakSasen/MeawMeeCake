const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require("../models/usersModel");
const crypto = require("crypto");
const sendVerifyEmail = require("../utils/sendVerifyEmail");

// --- Google Login ---
exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({ email });

        // --- กรณีสมัครครั้งแรก ---
        if (!user) {
            console.log("สมัครครั้งแรก: กำลังสร้าง User และส่งเมลยืนยัน...");
            const token = crypto.randomBytes(32).toString("hex");
            
            user = await User.create({
                user_fullname: name,
                email: email,
                googleId: googleId,
                authProvider: "google",
                role: "Customer",
                user_phone: "-", 
                user_img: picture,
                isEmailVerified: false,
                emailVerifyToken: token
            });

            // ส่งอีเมลยืนยันตัวตน
            await sendVerifyEmail(user.email, token);

            // ส่งกลับไปบอก Frontend ว่า "ต้องไปยืนยันเมลก่อนนะ"
            return res.status(200).json({
                needVerify: true,
                message: "สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตนก่อนเข้าสู่ระบบ"
            });
        }

        // --- กรณีมี User แล้ว แต่ยังไม่ได้ยืนยันเมล ---
        if (!user.isEmailVerified) {
            return res.status(200).json({
                needVerify: true,
                message: "คุณยังไม่ได้ยืนยันอีเมล กรุณาตรวจสอบในกล่องข้อความของคุณ"
            });
        }

        // --- กรณีที่ยืนยันเมลแล้ว ถึงจะยอมให้ Login ---
        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: "การเข้าสู่ระบบล้มเหลว" });
            
            return res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    email: user.email,
                    user_fullname: user.user_fullname,
                    role: user.role
                }
            });
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(400).json({ message: "Invalid Google Token" });
    }
};

// --- Verify Email (สำหรับลิงก์จากอีเมล) ---
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params; // รับจาก URL /verify-email/:token
        console.log("เริ่มตรวจสอบ Token ยืนยันอีเมล:", token);

        const user = await User.findOne({
            emailVerifyToken: token
        });

        if (!user) {
            console.log("ไม่พบ Token หรือ Token ผิด");
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?success=false`);
        }

        // อัปเดตสถานะในฐานข้อมูล
        user.isEmailVerified = true;
        user.emailVerifyToken = undefined; // ลบ Token ทิ้งเมื่อใช้แล้ว
        await user.save();

        console.log("ยืนยันอีเมลสำเร็จสำหรับ:", user.email);
        // Redirect to frontend dashboard so SPA can decide next steps
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?verified=true`);
        
    } catch (err) {
        console.error("Verify Email Error:", err);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?success=false`);
    }
};

// --- Register (local) ---
exports.register = async (req, res) => {
    try {
        const {
            user_fullname,
            email,
            password,
            user_phone,
            user_birthdate,
            user_allergies,
            role = "Customer",
            googleId,
        } = req.body;

        if (!email || !password || !user_fullname) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }

        let existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
        const token = crypto.randomBytes(32).toString("hex");

        const user = await User.create({
            user_fullname,
            email,
            password,
            user_phone: user_phone || "",
            user_birthdate: user_birthdate || null,
            user_allergies: user_allergies || [],
            role,
            authProvider: googleId ? "google" : "local",
            googleId: googleId || null,
            isEmailVerified: false,
            emailVerifyToken: token,
        });

        // send verification email (best-effort)
        await sendVerifyEmail(user.email, token);

        return res.status(201).json({ success: true, message: "ลงทะเบียนสำเร็จ โปรดยืนยันอีเมลของคุณ" });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
};

// --- Login (local) ---
exports.login = async (req, res, next) => {
    try {
        const { email, password, role: requestedRole } = req.body;
        if (!email || !password) return res.status(400).json({ message: "ไม่พบอีเมลหรือรหัสผ่าน กรุณากรอกข้อมูลให้ครบถ้วน" });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "ไม่พบผู้ใช้ที่มีอีเมลนี้ กรุณาตรวจสอบอีเมลของคุณอีกครั้ง" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" });

        if (!user.isEmailVerified) return res.status(403).json({ message: "กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ" });

        // If the frontend requested a specific role, ensure the user has it
        if (requestedRole && user.role && user.role.toLowerCase() !== requestedRole.toLowerCase()) {
            return res.status(403).json({ message: "ไม่สามารถเข้าสู่ระบบด้วยบทบาทที่ร้องขอได้" });
        }

        // establish session
        req.login(user, (err) => {
            if (err) return next(err);

            return res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    email: user.email,
                    user_fullname: user.user_fullname,
                    role: user.role,
                },
                // frontend expects a token; provide a simple marker for SPA routing
                token: "local_authenticated",
            });
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};