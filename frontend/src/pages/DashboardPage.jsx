import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Dropdown, Spinner } from "react-bootstrap";
import AdminDashboardComponent from "../components/AdminDashboardComponent";
import {CustomerDashboardComponent} from "../components/CustomerDashboardComponent";
import {EmployeeDashboardComponent} from "../components/EmployeeDashboardComponent";
import { authAPI } from "../services/authService";

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
          const userData = response.user || (response.data && response.data.user);
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

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  const renderDashboardContent = () => {
    if (!user) return null;

    const role = user.role.toLowerCase();

    switch (role) {
      case 'owner':
        return <AdminDashboardComponent />;
      case 'employee':
        return <EmployeeDashboardComponent />;
      case 'customer':
        return <CustomerDashboardComponent />;
      default:
        return (
          <Container style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              maxWidth: "500px",
              margin: "0 auto"
            }}>
              <h3 style={{ marginBottom: "16px" }}>ไม่พบข้อมูลผู้ใช้</h3>
              <p style={{ color: "#666", marginBottom: "24px" }}>
                ระบบไม่สามารถระบุบทบาทของคุณได้
              </p>
              <button
                onClick={handleLogout}
                style={{
                  padding: "12px 32px",
                  backgroundColor: "#FBBC05",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px"
                }}
              >
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          </Container>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container 
        fluid 
        style={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh",
          backgroundColor: "#f8f9fa"
        }}
      >
        <Spinner animation="border" variant="warning" style={{ width: "60px", height: "60px" }} />
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
          backgroundColor: "#f8f9fa"
        }}
      >
        <div style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "60px", color: "#dc3545", marginBottom: "20px" }}>
            ✕
          </div>
          <h3 style={{ marginBottom: "16px", color: "#dc3545" }}>เกิดข้อผิดพลาด</h3>
          <p style={{ color: "#666", marginBottom: "24px" }}>{error}</p>
          <p style={{ color: "#999", fontSize: "14px" }}>
            กำลังนำคุณกลับไปหน้าเข้าสู่ระบบ...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Navigation Bar */}
      <Navbar 
        bg="white" 
        expand="lg" 
        style={{ 
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          padding: "12px 0"
        }}
      >
        <Container fluid style={{ padding: "0 40px" }}>
          <Navbar.Brand 
            style={{ 
              fontWeight: "bold", 
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>🎂</span>
            <span>MeawMee Cake</span>
          </Navbar.Brand>

          <Nav className="ms-auto" style={{ alignItems: "center" }}>
            {/* User Info Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="user-dropdown"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontWeight: "500"
                }}
              >
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#FBBC05",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px"
                }}>
                  {user?.user_img ? (
                    <img 
                      src={user.user_img} 
                      alt="Profile" 
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        borderRadius: "50%",
                        objectFit: "cover"
                      }} 
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>
                    {user?.user_fullname}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {user?.role === 'Owner' ? 'เจ้าของร้าน' : 
                     user?.role === 'Employee' ? 'พนักงาน' : 'ลูกค้า'}
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ minWidth: "250px" }}>
                <div style={{ 
                  padding: "16px", 
                  borderBottom: "1px solid #eee",
                  marginBottom: "8px"
                }}>
                  <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                    {user?.user_fullname}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    {user?.email}
                  </div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#28a745",
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span>✓</span>
                    <span>อีเมลยืนยันแล้ว</span>
                  </div>
                </div>

                <Dropdown.Item 
                  onClick={() => navigate("/profile")}
                  style={{ padding: "12px 16px" }}
                >
                  <span style={{ marginRight: "8px" }}>👤</span>
                  โปรไฟล์
                </Dropdown.Item>

                <Dropdown.Item 
                  onClick={() => navigate("/settings")}
                  style={{ padding: "12px 16px" }}
                >
                  <span style={{ marginRight: "8px" }}>⚙️</span>
                  ตั้งค่า
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item 
                  onClick={handleLogout}
                  style={{ 
                    padding: "12px 16px",
                    color: "#dc3545",
                    fontWeight: "500"
                  }}
                >
                  <span style={{ marginRight: "8px" }}>🚪</span>
                  ออกจากระบบ
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>

      {/* Dashboard Content */}
      <Container fluid style={{ padding: "40px" }}>
        {renderDashboardContent()}
      </Container>
    </div>
  );
}