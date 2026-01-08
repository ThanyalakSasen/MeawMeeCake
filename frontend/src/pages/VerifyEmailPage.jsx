import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import authAPI from "../services/authService";
import { Container, Spinner } from "react-bootstrap";
import axios from "axios";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const statusParam = query.get("status");
  const emailParam = query.get("email");
  const isGoogleUserParam = query.get("isGoogleUser") === "true"; // 🔑 เช็ค Google login
  const userIdParam = query.get("userId"); // 🔑 ใช้สำหรับ ResetPasswordPage

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  const hasVerified = useRef(false); // ป้องกัน verify ซ้ำ

  useEffect(() => {
    // ถ้าเป็น Google user และไม่มี token → ไปหน้า ResetPasswordPage เลย
    if (!token && isGoogleUserParam) {
      navigate(`/reset-password/${userIdParam}`, { replace: true });
      return;
    }

    const verifyEmail = async () => {
      // ---------- INFO MODE (ไม่มี token แต่ status=info) ----------
      if (!token && statusParam === "info") {
        setStatus("info");
        setMessage(
          `เราได้ส่งลิงก์ยืนยันไปที่ ${emailParam || "อีเมลของคุณ"} แล้ว กรุณาตรวจสอบและยืนยันเพื่อเข้าสู่ระบบ`
        );
        return;
      }

      if (!token) {
        setStatus("info");
        setMessage(
          "กรุณาตรวจสอบอีเมลของคุณและคลิกลิงก์ยืนยัน หากไม่ได้รับอีเมล ให้ขอส่งอีเมลยืนยันใหม่"
        );
        return;
      }

      if (hasVerified.current) return;
      hasVerified.current = true;

      try {
        const response = await authAPI.verifyEmail(token);

        const { user } = response;

        

        if (response.success) { // <<< ใช้ response.success ไม่ใช่ user.success
    if (user?.isGoogleUser) {
      navigate("/update", {
        state: {
          isRegisterWithGoogle: true,
          fullname: user.fullname,
          email: user.email,
          userId: user._id,
        },
        replace: true,
      });
      return;
    }

    // สำหรับ user ปกติ → success + countdown ไป Dashboard
    setStatus("success");
    setMessage("ยืนยันอีเมลสำเร็จ! คุณจะไปยังหน้า Dashboard");

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
      } catch (error) {
        setStatus("error");

        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message;

          if (errorMessage?.includes("หมดอายุ")) {
            setMessage("ลิงก์ยืนยันหมดอายุแล้ว กรุณาขอลิงก์ใหม่");
          } else if (errorMessage?.includes("ไม่ถูกต้อง")) {
            setMessage("ลิงก์ยืนยันไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
          } else {
            setMessage(errorMessage || "เกิดข้อผิดพลาดในการยืนยันอีเมล");
          }
        } else {
          setMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
        }
      }
    };

    verifyEmail();
  }, [token, statusParam, emailParam, isGoogleUserParam, userIdParam, navigate]);

  const handleResendEmail = () => {
    navigate("/login", {
      state: { message: "กรุณาเข้าสู่ระบบและขอส่งอีเมลยืนยันใหม่" },
    });
  };

  return (
    <Container
      fluid
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "60px 40px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Loading State */}
        {status === "loading" && (
          <>
            <Spinner animation="border" variant="warning" style={{ width: "60px", height: "60px", marginBottom: "24px" }} />
            <h4 style={{ fontWeight: "bold", marginBottom: "12px" }}>กำลังยืนยันอีเมล...</h4>
            <p style={{ color: "#666", fontSize: "16px" }}>กรุณารอสักครู่ ระบบกำลังดำเนินการ</p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#d4edda", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "40px" }}>✓</div>
            <h3 style={{ color: "#28a745", marginBottom: "16px", fontWeight: "bold", fontSize: "28px" }}>ยืนยันอีเมลสำเร็จ!</h3>
            <p style={{ color: "#666", marginBottom: "24px" }}>{message}</p>

            <div style={{ padding: "20px", backgroundColor: "#FFF9E6", borderRadius: "8px", marginBottom: "24px" }}>
              กำลังนำคุณไปยังหน้าเข้าสู่ระบบใน <strong style={{ fontSize: "22px", color: "#FBBC05" }}>{countdown}</strong> วินาที
            </div>
          </>
        )}

        {/* Info State */}
        {status === "info" && (
          <>
            <h3>กรุณายืนยันอีเมล</h3>
            <p>{message}</p>
            <button onClick={handleResendEmail}>ขอส่งอีเมลยืนยันใหม่</button>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <h3 style={{ color: "red" }}>เกิดข้อผิดพลาด</h3>
            <p>{message}</p>
            <button onClick={() => navigate("/login")}>กลับไปหน้าเข้าสู่ระบบ</button>
          </>
        )}
      </div>
    </Container>
  );
}
