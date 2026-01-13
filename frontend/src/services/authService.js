// src/services/authService.js
import api from './api';


export const authAPI = {
  // ลงทะเบียน
  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  // เข้าสู่ระบบ
  async login(email, password) {
    localStorage.removeItem('token');
    const response = await api.post('/api/auth/login', { email, password });
   if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data; // ส่ง data กลับไปให้หน้า Login จัดการต่อ
  },
  
  // ยืนยันอีเมล
  async verifyEmail(token) {
    const response = await api.get(`/api/auth/verify-email/${token}`);
    return response.data;
  },
  
  // ส่งอีเมลยืนยันใหม่
  async resendVerification(email) {
    const response = await api.post('/api/auth/resend-verification', { email });
    return response.data;
  },

   //✅ กรอกข้อมูลครั้งแรก (หลัง Google Login)
  async completeProfile(userData) {
    const response = await api.put('/api/auth/complete-profile', userData);
    return response.data;
  },

  // ✅ อัพเดตข้อมูล (แก้ไขภายหลัง)
  async updateProfile(userData) {
    const response = await api.put('/api/auth/update-profile', userData);
    return response.data;
  },

  // ลืมรหัสผ่าน
  async forgotPassword(email) {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },
  
  // รีเซ็ตรหัสผ่าน
  async resetPassword(token, password) {
    const response = await api.post(`/api/auth/reset-password/${token}`, { password });
    return response.data;
  },
  
  // ดึงข้อมูลผู้ใช้
  async getCurrentUser() {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
  
  
  // ออกจากระบบ
  async logout() {
    await api.post('/api/auth/logout');
    localStorage.removeItem('token');
  },
  
  // Google OAuth URL
  getGoogleAuthUrl() {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/google`;
  }
};

export default authAPI;