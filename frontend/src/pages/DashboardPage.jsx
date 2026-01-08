import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();

  // ✅ ดึง logout ออกมาจาก Context
  const { user, loading, logout } = useAuth();

  // ✅ redirect หลังจากรู้สถานะแล้ว
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // ✅ ฟังก์ชันสำหรับจัดการการกดปุ่ม Logout
  const handleLogout = async () => {
    try {
      await logout(); // เรียกใช้ฟังก์ชัน logout จาก Context
      navigate("/login"); // เมื่อ logout สำเร็จ ให้ไปหน้า login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ✅ ป้องกัน render ตอนยังโหลด
  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>ยินดีต้อนรับ: <strong>{user.email}</strong></p>
      <p>ชื่อผู้ใช้: {user.name}</p>

      {/* ✅ ปุ่ม Logout */}
      <button 
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#ff4d4d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
          fontWeight: "bold"
        }}
      >
        ออกจากระบบ
      </button>
    </div>
  );
}