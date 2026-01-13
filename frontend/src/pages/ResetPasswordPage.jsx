import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(
          `http://localhost:3000/api/auth/verify-reset-token/${token}`
        );
        setLoading(false); // ✅ token ถูก → render หน้า
      } catch {
        navigate("/login"); // ❌ token ผิด → เด้งออก
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return Swal.fire("ผิดพลาด", "รหัสผ่านไม่ตรงกัน", "error");
    }

    try {
      await axios.post(
        `http://localhost:3000/api/auth/reset-password/${token}`,
        { password }
      );

      Swal.fire("สำเร็จ", "ตั้งรหัสผ่านใหม่แล้ว", "success").then(() =>
        navigate("/login")
      );
    } catch {
      Swal.fire("ล้มเหลว", "ลิงก์ไม่ถูกต้องหรือหมดอายุ", "error");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        ⏳ กำลังตรวจสอบลิงก์...
      </div>
    );
  }
  return (
    <div 
  style={{ 
    maxWidth: "450px", 
    margin: "80px auto", 
    padding: "40px", 
    boxShadow: "0 10px 30px rgba(245, 224, 150, 0.3)", // เงาสีทองจางๆ
    borderRadius: "24px", // โค้งมนนุ่มนวล
    backgroundColor: "#ffffff",
    border: "1px solid #FDF2D2"
  }}
>
  <div style={{ textAlign: "center", marginBottom: "25px" }}>
    <span style={{ fontSize: "40px" }}>🔑</span>
    <h2 style={{ 
      color: "#8D6E63", 
      fontWeight: "bold", 
      marginTop: "10px",
      fontSize: "26px" 
    }}>
      ตั้งรหัสผ่านใหม่
    </h2>
    <p style={{ color: "#A1887F", fontSize: "14px" }}>เพื่อความปลอดภัยในการเข้าใช้งานร้านของเรา</p>
  </div>

  <form onSubmit={handleSubmit}>
    <label style={{ color: "#5D4037", fontWeight: "600", marginLeft: "4px" }}>รหัสผ่านใหม่</label>
    <input
      type="password"
      required
      minLength="6"
      placeholder="อย่างน้อย 6 ตัวอักษร"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={{ 
        width: "100%", 
        padding: "14px", 
        marginTop: "8px", 
        marginBottom: "20px", 
        borderRadius: "16px", // input โค้งมน
        border: "2px solid #FDF2D2", // ขอบสีเหลืองอ่อน
        backgroundColor: "#FFFEFA",
        outline: "none",
        transition: "border-color 0.3s"
      }}
      onFocus={(e) => e.target.style.borderColor = "#FFD95A"}
      onBlur={(e) => e.target.style.borderColor = "#FDF2D2"}
    />

    <label style={{ color: "#5D4037", fontWeight: "600", marginLeft: "4px" }}>ยืนยันรหัสผ่านใหม่</label>
    <input
      type="password"
      required
      placeholder="กรอกรหัสผ่านอีกครั้ง"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      style={{ 
        width: "100%", 
        padding: "14px", 
        marginTop: "8px", 
        marginBottom: "25px", 
        borderRadius: "16px", 
        border: "2px solid #FDF2D2",
        backgroundColor: "#FFFEFA",
        outline: "none"
      }}
      onFocus={(e) => e.target.style.borderColor = "#FFD95A"}
      onBlur={(e) => e.target.style.borderColor = "#FDF2D2"}
    />

    <button
      type="submit"
      style={{ 
        width: "100%", 
        padding: "14px", 
        backgroundColor: "#FFD95A", // สีเหลืองน้ำผึ้ง
        color: "#5D4037", 
        border: "none", 
        borderRadius: "50px", // ทรงแคปซูล
        fontWeight: "bold", 
        fontSize: "16px",
        cursor: "pointer",
        boxShadow: "0 4px 0 #F4B400", // เพิ่มมิติเหมือนปุ่มกด
        transition: "all 0.2s"
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = "#F4B400"}
      onMouseOut={(e) => e.target.style.backgroundColor = "#FFD95A"}
    >
      ยืนยันการเปลี่ยนรหัสผ่าน
    </button>
  </form>

  {status.message && (
    <div 
      style={{ 
        marginTop: "25px", 
        padding: "12px",
        borderRadius: "12px",
        textAlign: "center", 
        fontSize: "14px",
        backgroundColor: status.type === "success" ? "#E8F5E9" : "#FFEBEE",
        color: status.type === "success" ? "#2E7D32" : "#C62828" 
      }}
    >
      {status.type === "success" ? "✨ " : "❌ "}
      {status.message}
    </div>
  )}
</div>
  );
}