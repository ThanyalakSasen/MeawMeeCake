// export default function EmployeeDashboardComponent() {
//     return (
//         <>EmployeeDashboardComponent</>
//     );
// }

// EmployeeDashboardComponent.jsx
import { Card, Row, Col, Badge } from "react-bootstrap";

export function EmployeeDashboardComponent() {
  return (
    <div>
      <h2 style={{ marginBottom: "24px", fontWeight: "bold" }}>
        👨‍💼 แดชบอร์ดพนักงาน
      </h2>
      
      <p style={{ color: "#666", marginBottom: "32px" }}>
        สวัสดีตอนเช้า!
      </p>

      <Row>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h5>📋 งานของวันนี้</h5>
              <h3 style={{ color: "#FBBC05" }}>0</h3>
              <p className="text-muted">ยังไม่มีงานที่มอบหมาย</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h5>✅ งานที่เสร็จแล้ว</h5>
              <h3 style={{ color: "#28a745" }}>0</h3>
              <p className="text-muted">สัปดาห์นี้</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h5>⏰ ชั่วโมงการทำงาน</h5>
              <h3 style={{ color: "#FBBC05" }}>0 ชม.</h3>
              <p className="text-muted">เดือนนี้</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Body>
          <h5 className="mb-3">📌 งานล่าสุด</h5>
          <div style={{
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p className="text-muted">ยังไม่มีงานที่มอบหมาย</p>
            <small>งานใหม่จะแสดงที่นี่เมื่อมีการมอบหมาย</small>
          </div>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <h5 className="mb-3">📊 สถิติประจำเดือน</h5>
          <Row>
            <Col md={6}>
              <div style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>คำสั่งซื้อที่จัดการ</span>
                  <Badge bg="warning" text="dark">0</Badge>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div style={{ marginBottom: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>เค้กที่ผลิต</span>
                  <Badge bg="warning" text="dark">0</Badge>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}