import { Card, Row, Col, Container } from "react-bootstrap";
import Sidebar from "./SideBarMenu";

export default function AdminDashboardComponent() {
  return (
    <Container style={{ minHeight: "100vh", backgroundColor: "#F0F0FA", width: "100%" }}>
      <Row>
        <Col md={10} lg={9} className="p-4">
          {/* Dashboard Cards */}
          <Row className="mb-4">
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

          {/* Feature List */}
          <Row>
            <Col>
              <Card>
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
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
