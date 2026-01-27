// Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/InputField";
import InputCheckbox from "../components/inputcheckbox";
import ButtonSubmit from "../components/button";
import { authAPI } from "../services/authService";
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";
import loginPicture from "../assets/pictures/LoginRegisterPicture.png";
import googleLogo from "../assets/pictures/googleLogo.svg";
import { useAuth } from '../context/AuthContext'; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  // ส่วนหนึ่งของ Login.jsx
const { checkAuth } = useAuth(); 

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // authAPI.login ควรทำการเก็บ localStorage.setItem('token', ...) ไว้ข้างในแล้ว
    await authAPI.login(email, password);
    
    // ✅ เรียกใช้เพื่ออัปเดตข้อมูล User ใน Global State
    await checkAuth(); 
    
    navigate("/dashboard");
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      alert("กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ");
    } else {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  } finally {
    setLoading(false);
  }
};

  const handleGoogleLogin = () => {
    // ใช้ authAPI แทนการ hardcode URL
    window.location.href = authAPI.getGoogleAuthUrl();
  };

  return (
    <Container fluid>
      <Row style={{ width: "100%" }}>
        <Col sm={4} style={{ padding: 0 }}>
          <img
            src={loginPicture}
            alt="Login"
            style={{ width: "100%", height: "auto" }}
          />
        </Col>

        <Col sm={8} style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "60%", marginTop: "20%" }}>
            <h4>เข้าสู่ระบบ</h4>

            <form onSubmit={handleLogin}>
              <InputField
                label="อีเมลผู้ใช้งาน"
                placeholder="example@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                label="รหัสผ่าน"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <InputCheckbox label="จำไว้ใช้คราวหน้า" />

              <ButtonSubmit
                type="submit"
                textButton={loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                disabled={loading}
                style={{
                  backgroundColor: "#FBBC05",
                  width: "100%",
                  border: "0px",
                  color: "black",
                  fontWeight: "bold",
                  margin: "16px 0",
                }}
              />
            </form>

            <div style={{ textAlign: "right", marginBottom: "24px" }}>
              <button
                onClick={() => navigate("/forgot-password")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "black",
                }}
              >
                ลืมรหัสผ่าน?
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "black" }} />
              <span>หรือ</span>
              <div style={{ flex: 1, height: "1px", background: "black" }} />
            </div>

            <button
              onClick={handleGoogleLogin}
              style={{
                width: "100%",
                height: "40px",
                color: "black",
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <img src={googleLogo} alt="Google" width={20} />
              <span>เข้าสู่ระบบด้วย Google</span>
            </button>

            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button
                onClick={() =>
                  navigate("/register", {
                    state: { isRegisterWithGoogle: false },
                  })
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "black",
                }}
              >
                สมัครสมาชิก
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}