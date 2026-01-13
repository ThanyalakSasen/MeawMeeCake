import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      Swal.fire({
        icon: "success",
        title: "ส่งลิงก์แล้ว",
        text: "กรุณาตรวจสอบอีเมลของคุณ",
      }).then(() => navigate("/login"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ผิดพลาด",
        text: err.response?.data?.message || "เกิดข้อผิดพลาด",
      });
    }
  };

  return (
    <div 
  style={{ 
    maxWidth: "450px", 
    margin: "100px auto", 
    padding: "45px 35px", 
    boxShadow: "0 12px 40px rgba(245, 224, 150, 0.3)", // เงาสีทองนุ่มๆ
    borderRadius: "30px", // โค้งมนพิเศษแบบก้อนขนมปัง
    backgroundColor: "#ffffff",
    border: "1px solid #FDF2D2",
    textAlign: "center",
    position: "relative",
    overflow: "hidden"
  }}
>
  {/* ตกแต่งแถบสีด้านบนให้น่ารัก */}
  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", backgroundColor: "#FFD95A" }}></div>

  
  <h2 style={{ 
    color: "#8D6E63", 
    fontWeight: "bold", 
    marginBottom: "12px",
    fontSize: "24px" 
  }}>
    ลืมรหัสผ่านใช่ไหมคะ?
  </h2>
  
  <p style={{ color: "#A1887F", marginBottom: "30px", fontSize: "15px", lineHeight: "1.5" }}>
    ระบุอีเมลที่ใช้ลงทะเบียน เพื่อตั้งรหัสใหม่ให้ทางอีเมล
  </p>
  
  <form onSubmit={handleSubmit}>
    <div style={{ textAlign: "left", marginBottom: "8px", marginLeft: "6px", color: "#5D4037", fontWeight: "600", fontSize: "14px" }}>
      อีเมลของคุณ
    </div>
    <input
      type="email"
      required
      
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      style={{ 
        width: "100%", 
        padding: "14px 20px", 
        marginBottom: "25px", 
        borderRadius: "18px", 
        border: "2px solid #FDF2D2",
        backgroundColor: "#FFFEFA",
        fontSize: "16px",
        outline: "none",
        transition: "all 0.3s ease"
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#FFD95A";
        e.target.style.boxShadow = "0 0 8px rgba(255, 217, 90, 0.4)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#FDF2D2";
        e.target.style.boxShadow = "none";
      }}
    />
    
    <button
      type="submit"
      disabled={loading}
      style={{ 
        width: "100%", 
        padding: "15px", 
        backgroundColor: loading ? "#E0E0E0" : "#FFD95A", 
        color: "#5D4037", 
        border: "none", 
        borderRadius: "50px", 
        fontWeight: "bold", 
        fontSize: "16px",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: loading ? "none" : "0 4px 0 #F4B400",
        transition: "transform 0.1s, background-color 0.2s"
      }}
      onMouseDown={(e) => !loading && (e.target.style.transform = "translateY(2px)", e.target.style.boxShadow = "none")}
      onMouseUp={(e) => !loading && (e.target.style.transform = "translateY(0px)", e.target.style.boxShadow = "0 4px 0 #F4B400")}
    >
      {loading ? "กำลังเตรียมข้อมูล..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
    </button>
  </form>

  {status.message && (
    <div 
      style={{ 
        marginTop: "25px", 
        padding: "15px", 
        borderRadius: "15px", 
        backgroundColor: status.type === "success" ? "#E8F5E9" : "#FFF1F0", 
        color: status.type === "success" ? "#2E7D32" : "#D32F2F",
        fontSize: "14px",
        border: `1px solid ${status.type === "success" ? "#C8E6C9" : "#FFCCC7"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
      }}
    >
      {status.type === "success" ? "✅" : "❌"} {status.message}
    </div>
  )}

  <div style={{ marginTop: "30px" }}>
    <a 
      href="/login" 
      style={{ 
        color: "#A1887F", 
        fontSize: "14px", 
        textDecoration: "none",
        borderBottom: "1px solid #A1887F"
      }}
    >
      กลับไปหน้าเข้าสู่ระบบ
    </a>
  </div>
</div>
  );
}