import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const user = JSON.parse(userStr);

        if (!user || !user.role) {
          console.error("Invalid user data");
          localStorage.clear();
          setIsAuthenticated(false);
          return;
        }

        setUserRole(user.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user:", error);
        localStorage.clear();
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Loading
  if (isAuthenticated === null) {
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
        <Spinner
          animation="border"
          variant="warning"
          style={{ width: "60px", height: "60px" }}
        />
        <p
          style={{
            marginTop: "20px",
            color: "#666",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          กำลังตรวจสอบสิทธิ์...
        </p>
      </Container>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Role-based access control
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some(
      (role) => role.toLowerCase() === userRole.toLowerCase()
    );

    if (!hasAccess) {
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
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#fff3cd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "40px",
              }}
            >
              🔒
            </div>

            <h2
              style={{
                fontWeight: "bold",
                marginBottom: "16px",
                fontSize: "28px",
              }}
            >
              ไม่มีสิทธิ์เข้าถึง
            </h2>

            <p
              style={{
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "32px",
              }}
            >
              คุณไม่มีสิทธิ์เข้าถึงหน้านี้
              <br />
              กรุณาติดต่อผู้ดูแลระบบหากคุณคิดว่านี่เป็นข้อผิดพลาด
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => window.history.back()}
                style={{
                  padding: "12px 32px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                ← ย้อนกลับ
              </button>

              <button
                onClick={() => (window.location.href = "/dashboard")}
                style={{
                  padding: "12px 32px",
                  backgroundColor: "#FBBC05",
                  color: "black",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                กลับหน้าหลัก
              </button>
            </div>

            <div
              style={{
                marginTop: "32px",
                padding: "16px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#666",
              }}
            >
              <strong>บทบาทของคุณ:</strong> {userRole}
              <br />
              <strong>บทบาทที่อนุญาต:</strong>{" "}
              {allowedRoles.join(", ")}
            </div>
          </div>
        </Container>
      );
    }
  }

  // Authorized
  return <>{children}</>;
}
