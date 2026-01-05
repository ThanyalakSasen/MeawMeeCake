import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setStatus({ type: "error", message: "รหัสผ่านไม่ตรงกัน" });
    }

    try {
      const response = await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, { password });
      setStatus({ type: "success", message: response.data.message });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.message || "ลิงก์หมดอายุหรือผิดพลาด" });
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "100px auto", padding: "30px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", borderRadius: "12px" }}>
      <h2 style={{ textAlign: "center" }}>🆕 ตั้งรหัสผ่านใหม่</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <label>รหัสผ่านใหม่:</label>
        <input
          type="password"
          required
          minLength="6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "12px", marginTop: "8px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd" }}
        />
        <label>ยืนยันรหัสผ่านใหม่:</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: "100%", padding: "12px", marginTop: "8px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ddd" }}
        />
        <button
          type="submit"
          style={{ width: "100%", padding: "12px", backgroundColor: "#f97316", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
        >
          ยืนยันการเปลี่ยนรหัสผ่าน
        </button>
      </form>
      {status.message && (
        <p style={{ marginTop: "20px", textAlign: "center", color: status.type === "success" ? "green" : "red" }}>
          {status.message}
        </p>
      )}
    </div>
  );
}