// src/pages/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ 1. นำเข้า useAuth

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth(); // ✅ 2. ดึงฟังก์ชันตรวจสอบสถานะมาใช้
  
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (token) {
      localStorage.setItem('token', token);
      
      // ✅ 3. เรียก checkAuth เพื่ออัปเดต State 'user' ใน Context ทันที
      checkAuth().then(() => {
        navigate('/dashboard');
      });
      
    } else if (error) {
      alert('เข้าสู่ระบบด้วย Google ไม่สำเร็จ');
      navigate('/login');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, checkAuth]);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p>กำลังยืนยันตัวตนและเข้าสู่ระบบ...</p>
      </div>
    </div>
  );
};

export default AuthCallback;