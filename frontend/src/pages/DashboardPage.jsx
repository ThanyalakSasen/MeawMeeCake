import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Dropdown,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import AdminDashboardComponent from "../components/AdminDashboardComponent";
import { CustomerDashboardComponent } from "../components/CustomerDashboardComponent";
import { EmployeeDashboardComponent } from "../components/EmployeeDashboardComponent";
import NavBar from "../components/NavBar";
import { authAPI } from "../services/authService";
import SideBarMenu from "../components/SideBarMenu";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initDashboard = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        // Try to get user from localStorage first
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            setUser(userData);
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }

        // Fetch current user from API to ensure data is up-to-date
        const response = await authAPI.getCurrentUser();
        if (response && response.success) {
          const userData =
            response.user || (response.data && response.data.user);
          if (userData) {
            // 🔴 ตรวจสอบว่ากรอกข้อมูลครบหรือยัง (สำหรับ Google Login)
            if (userData.profileCompleted === false) {
              navigate("/complete-profile", { replace: true });
              return;
            }

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error("Dashboard init error:", error);
        setError("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
        // Clear invalid data and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [navigate, setUser]);

  const renderDashboardContent = () => {
    if (!user) return null;

    const role = user.role.toLowerCase();

    switch (role) {
      case "owner":
        return <AdminDashboardComponent />;
      case "employee":
        return <EmployeeDashboardComponent />;
      case "customer":
        return <CustomerDashboardComponent />;
      default:
        return (
          <Container style={{ textAlign: "center", padding: "60px 20px" }}>
            <div
              style={{
                backgroundColor: "white",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              <h3 style={{ marginBottom: "16px" }}>ไม่พบข้อมูลผู้ใช้</h3>
              <p style={{ color: "#666", marginBottom: "24px" }}>
                ระบบไม่สามารถระบุบทบาทของคุณได้
              </p>
            </div>
          </Container>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Spinner
          animation="border"
          variant="warning"
          style={{ width: "60px", height: "60px" }}
        />
        <p style={{ marginTop: "20px", color: "#666", fontSize: "18px" }}>
          กำลังโหลดข้อมูล...
        </p>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container
        fluid
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "60px", color: "#dc3545", marginBottom: "20px" }}
          >
            ✕
          </div>
          <h3 style={{ marginBottom: "16px", color: "#dc3545" }}>
            เกิดข้อผิดพลาด
          </h3>
          <p style={{ color: "#666", marginBottom: "24px" }}>{error}</p>
          <p style={{ color: "#999", fontSize: "14px" }}>
            กำลังนำคุณกลับไปหน้าเข้าสู่ระบบ...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid style={{ minHeight: "100vh", backgroundColor: "#F0F0FA" }}>
      <Row>
        {/* Sidebar */}
        <Col md={3} className="p-0 bg-white">
          <SideBarMenu />
        </Col>

        {/* Main */}
        <Col md={9} className="p-0">
          <NavBar />
          <Row>
            <Col>
                {renderDashboardContent()}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
