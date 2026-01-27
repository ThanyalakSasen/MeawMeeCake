import { Container, Navbar, Nav, Dropdown, Spinner } from "react-bootstrap";
import { authAPI } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar({ titleMain }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
  const title = titleMain || "MeawMee Cake";

return (
  <Navbar
    bg="white"
    expand="lg"
    style={{
      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      padding: "12px 0",
      margin:"2%",
      borderRadius: "10px",
    }}
  >
    <Container style={{ padding: "0 40px" }}>
      <Navbar.Brand
        style={{
          fontWeight: "bold",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>{title}</span>
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
              fontWeight: "500",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#FBBC05",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              {user?.user_img ? (
                <img
                  src={user.user_img}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
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
                {user?.role === "Owner"
                  ? "เจ้าของร้าน"
                  : user?.role === "Employee"
                    ? "พนักงาน"
                    : "ลูกค้า"}
              </div>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ minWidth: "250px" }}>
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #eee",
                marginBottom: "8px",
              }}
            >
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                {user?.user_fullname}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                {user?.email}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#28a745",
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
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

            <Dropdown.Divider />

            <Dropdown.Item
              onClick={handleLogout}
              style={{
                padding: "12px 16px",
                color: "#dc3545",
                fontWeight: "500",
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
  );
}
