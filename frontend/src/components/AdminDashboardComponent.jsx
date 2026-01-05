// export default function AdminDashboardComponent() {
//     return (
//         <>AdminDashboardComponent</>
//     );
// }

// AdminDashboardComponent.jsx
import { Card, Row, Col } from "react-bootstrap";

export default function AdminDashboardComponent() {
  return (
    <div>
      <h2 style={{ marginBottom: "24px", fontWeight: "bold" }}>
        👑 แดชบอร์ดเจ้าของร้าน
      </h2>
      
      <p style={{ color: "#666", marginBottom: "32px" }}>
        ยินดีต้อนรับสู่ระบบจัดการร้าน Meawmee Cake
      </p>

      <Row>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h5>📊 ยอดขายวันนี้</h5>
              <h3 style={{ color: "#FBBC05" }}>฿0</h3>
              <p className="text-muted">ยังไม่มีข้อมูล</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h5>🛒 คำสั่งซื้อใหม่</h5>
              <h3 style={{ color: "#FBBC05" }}>0</h3>
              <p className="text-muted">ยังไม่มีคำสั่งซื้อ</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h5>👥 ลูกค้าทั้งหมด</h5>
              <h3 style={{ color: "#FBBC05" }}>0</h3>
              <p className="text-muted">ยังไม่มีลูกค้า</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Body>
          <h5>🎯 ฟีเจอร์ที่สามารถใช้งานได้</h5>
          <ul>
            <li>จัดการสินค้า (เพิ่ม/แก้ไข/ลบเค้ก)</li>
            <li>จัดการคำสั่งซื้อ</li>
            <li>จัดการพนักงาน</li>
            <li>ดูรายงานยอดขาย</li>
            <li>ตั้งค่าร้าน</li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
}

