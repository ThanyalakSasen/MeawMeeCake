import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ปรับ URL ตามความเหมาะสมของโปรเจกต์คุณ
      const response = await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      setStatus({ type: "success", message: response.data.message });
    } catch (error) {
      setStatus({ 
        type: "error", 
        message: error.response?.data?.message || "เกิดข้อผิดพลาดในการส่งอีเมล" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "100px auto", padding: "30px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", borderRadius: "12px", textAlign: "center" }}>
      <h2 style={{ marginBottom: "10px" }}>🔐 ลืมรหัสผ่านใช่ไหม?</h2>
      <p style={{ color: "#666", marginBottom: "25px" }}>ระบุอีเมลที่ใช้ลงทะเบียนเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="ใส่อีเมลของคุณ"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ddd" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "12px", backgroundColor: "#f97316", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "กำลังดำเนินการ..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
        </button>
      </form>

      {status.message && (
        <p style={{ marginTop: "20px", padding: "10px", borderRadius: "6px", backgroundColor: status.type === "success" ? "#dcfce7" : "#fee2e2", color: status.type === "success" ? "#166534" : "#991b1b" }}>
          {status.message}
        </p>
      )}
    </div>
  );
}