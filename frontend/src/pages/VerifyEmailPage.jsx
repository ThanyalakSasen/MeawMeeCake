import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import { Container, Spinner } from "react-bootstrap";
import axios from "axios";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const fromPath = query.get('from');
  const [status, setStatus] = useState<"loading" | "success" | "error" | "info">("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        // No token — show informational "check your email" page
        setStatus("info");
        setMessage("กรุณาตรวจสอบอีเมลของคุณและคลิกลิงก์ยืนยัน หากไม่ได้รับอีเมล ให้ขอส่งอีเมลยืนยันใหม่");
        return;
      }

      try {
        const response = await authAPI.verifyEmail(token);

        if (response.data.success) {
          setStatus("success");
          setMessage("ยืนยันอีเมลสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว");

          // Start countdown
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate("/login");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
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
  }, [token, navigate]);

  const handleResendEmail = () => {
    navigate("/login", { 
      state: { 
        message: "กรุณาเข้าสู่ระบบและขอส่งอีเมลยืนยันใหม่" 
      } 
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
        padding: "40px 20px"
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
            <Spinner
              animation="border"
              variant="warning"
              style={{ width: "60px", height: "60px", marginBottom: "24px" }}
            />
            <h4 style={{ fontWeight: "bold", marginBottom: "12px" }}>
              กำลังยืนยันอีเมล...
            </h4>
            <p style={{ color: "#666", fontSize: "16px" }}>
              กรุณารอสักครู่ ระบบกำลังดำเนินการ
            </p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#d4edda",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "40px"
              }}
            >
              ✓
            </div>
            <h3 style={{ 
              color: "#28a745", 
              marginBottom: "16px",
              fontWeight: "bold",
              fontSize: "28px"
            }}>
              ยืนยันอีเมลสำเร็จ!
            </h3>
            <p style={{ 
              color: "#666", 
              marginBottom: "24px",
              fontSize: "16px",
              lineHeight: "1.6"
            }}>
              {message}
            </p>
            
            <div style={{
              padding: "20px",
              backgroundColor: "#FFF9E6",
              borderRadius: "8px",
              marginBottom: "24px"
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: "16px",
                fontWeight: "500"
              }}>
                กำลังนำคุณไปยังหน้าเข้าสู่ระบบใน{" "}
                <span style={{ 
                  color: "#FBBC05", 
                  fontSize: "24px",
                  fontWeight: "bold"
                }}>
                  {countdown}
                </span>
                {" "}วินาที...
              </p>
            </div>

            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "14px 40px",
                backgroundColor: "#FBBC05",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "16px",
                width: "100%",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e5ab04";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FBBC05";
              }}
            >
              เข้าสู่ระบบทันที →
            </button>
          </>
        )}

        {/* Info State (no token / prompt check email) */}
        {status === "info" && (
          <>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#fff3cd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: "28px",
              color: "#856404"
            }}>
              i
            </div>
            <h3 style={{
              color: "#856404",
              marginBottom: "16px",
              fontWeight: "bold",
              fontSize: "24px"
            }}>
              กรุณายืนยันอีเมล
            </h3>
            <p style={{
              color: "#666",
              marginBottom: "24px",
              fontSize: "16px",
              lineHeight: "1.6"
            }}>
              {message}
            </p>

            {fromPath && (
              <div style={{ marginBottom: "16px", color: "#666" }}>
                หลังจากยืนยันแล้ว ระบบจะพาคุณกลับไปยัง <strong>{fromPath}</strong>
              </div>
            )}

            <div style={{
              display: "flex",
              gap: "12px",
              flexDirection: "column"
            }}>
              <button
                onClick={handleResendEmail}
                style={{
                  padding: "14px 40px",
                  backgroundColor: "#FBBC05",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e5ab04";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FBBC05";
                }}
              >
                ขอส่งอีเมลยืนยันใหม่
              </button>

              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "14px 40px",
                  backgroundColor: "white",
                  color: "#333",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "all 0.3s ease"
                }}
              >
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#f8d7da",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "40px"
              }}
            >
              ✕
            </div>
            <h3 style={{ 
              color: "#dc3545", 
              marginBottom: "16px",
              fontWeight: "bold",
              fontSize: "28px"
            }}>
              เกิดข้อผิดพลาด
            </h3>
            <p style={{ 
              color: "#666", 
              marginBottom: "32px",
              fontSize: "16px",
              lineHeight: "1.6"
            }}>
              {message}
            </p>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              {message.includes("หมดอายุ") && (
                <button
                  onClick={handleResendEmail}
                  style={{
                    padding: "14px 40px",
                    backgroundColor: "#FBBC05",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e5ab04";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FBBC05";
                  }}
                >
                  ขอส่งอีเมลยืนยันใหม่
                </button>
              )}

              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "14px 40px",
                  backgroundColor: message.includes("หมดอายุ") ? "white" : "#FBBC05",
                  color: message.includes("หมดอายุ") ? "#333" : "black",
                  border: message.includes("หมดอายุ") ? "1px solid #ddd" : "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  if (message.includes("หมดอายุ")) {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                  } else {
                    e.currentTarget.style.backgroundColor = "#e5ab04";
                  }
                }}
                onMouseLeave={(e) => {
                  if (message.includes("หมดอายุ")) {
                    e.currentTarget.style.backgroundColor = "white";
                  } else {
                    e.currentTarget.style.backgroundColor = "#FBBC05";
                  }
                }}
              >
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            </div>

            <div style={{
              marginTop: "24px",
              padding: "16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#666",
              textAlign: "left"
            }}>
              <strong style={{ display: "block", marginBottom: "8px" }}>
                💡 คำแนะนำ:
              </strong>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                <li>ตรวจสอบว่าคุณคลิกลิงก์ที่ถูกต้องจากอีเมล</li>
                <li>ลิงก์ยืนยันมีอายุ 24 ชั่วโมง</li>
                <li>หากหมดอายุ สามารถขอส่งอีเมลใหม่ได้</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}