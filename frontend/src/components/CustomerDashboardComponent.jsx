// export default function CustomerDashboardComponent() {
//     return (
//         <>CustomerDashboardComponent</>
//     );
// }

// CustomerDashboardComponent.jsx
import { Card, Row, Col, Button } from "react-bootstrap";

export function CustomerDashboardComponent() {
  return (
    <div>
      <h2 style={{ marginBottom: "24px", fontWeight: "bold" }}>
        🛍️ แดชบอร์ดลูกค้า
      </h2>
      
      <p style={{ color: "#666", marginBottom: "32px" }}>
        ยินดีต้อนรับสู่ Meawmee Cake
      </p>

      <Row>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <h5>📦 คำสั่งซื้อของฉัน</h5>
              <h3 style={{ color: "#FBBC05" }}>0</h3>
              <p className="text-muted">ยังไม่มีคำสั่งซื้อ</p>
              <Button 
                variant="warning" 
                className="mt-2"
                style={{ backgroundColor: "#FBBC05", border: "none", color: "black" }}
              >
                เริ่มสั่งซื้อ
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <h5>❤️ รายการโปรด</h5>
              <h3 style={{ color: "#FBBC05" }}>0</h3>
              <p className="text-muted">ยังไม่มีรายการโปรด</p>
              <Button 
                variant="outline-warning" 
                className="mt-2"
                style={{ borderColor: "#FBBC05", color: "#FBBC05" }}
              >
                เรียกดูเค้ก
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Body>
          <h5>หมวดหมู่เค้ก</h5>
          <Row className="mt-3">
            <Col md={3} className="text-center mb-3">
              <div style={{
                padding: "20px",
                backgroundColor: "#FFF9E6",
                borderRadius: "8px",
                cursor: "pointer"
              }}>
                <div style={{ fontSize: "40px" }}>🎂</div>
                <p style={{ marginTop: "10px", fontWeight: "500" }}>เค้กวันเกิด</p>
              </div>
            </Col>
            <Col md={3} className="text-center mb-3">
              <div style={{
                padding: "20px",
                backgroundColor: "#FFF9E6",
                borderRadius: "8px",
                cursor: "pointer"
              }}>
                <div style={{ fontSize: "40px" }}>💑</div>
                <p style={{ marginTop: "10px", fontWeight: "500" }}>เค้กแต่งงาน</p>
              </div>
            </Col>
            <Col md={3} className="text-center mb-3">
              <div style={{
                padding: "20px",
                backgroundColor: "#FFF9E6",
                borderRadius: "8px",
                cursor: "pointer"
              }}>
                <div style={{ fontSize: "40px" }}>🧁</div>
                <p style={{ marginTop: "10px", fontWeight: "500" }}>คัพเค้ก</p>
              </div>
            </Col>
            <Col md={3} className="text-center mb-3">
              <div style={{
                padding: "20px",
                backgroundColor: "#FFF9E6",
                borderRadius: "8px",
                cursor: "pointer"
              }}>
                <div style={{ fontSize: "40px" }}>🍰</div>
                <p style={{ marginTop: "10px", fontWeight: "500" }}>เค้กทั่วไป</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}