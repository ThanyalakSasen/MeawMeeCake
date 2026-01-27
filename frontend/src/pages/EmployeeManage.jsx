import { useState, useEffect } from "react";
import SideBarMenu from "../components/SideBarMenu";
import NavBar from "../components/NavBar";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { InputField } from "../components/InputField";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import api from "../services/api";

export default function EmployeeManage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/auth/admin/employees");
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.user_fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.emp_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
      <Row className="g-0" style={{ minHeight: "100vh" }}>
        
        {/* Sidebar */}
        <Col md={3} lg={3} className="bg-white">
          <SideBarMenu />
        </Col>

        {/* Content */}
        <Col md={9} lg={9} style={{ backgroundColor: "#F0F0FA" }}>
          
          {/* Navbar */}
          <div className="p-3">
            <NavBar titleMain="รายชื่อพนักงาน" />
          </div>

          {/* Search + Button */}
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              margin: "0 20px 20px",
            }}
          >
            <Row className="align-items-center p-0 w-80">
              <Col md={6}>
                <form
                  style={{ display: "flex", gap: "10px" }}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <InputField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาชื่อ, อีเมล, รหัสพนักงาน"
                  />
                </form>
              </Col>
              <Col md={6} className="text-end">
                <Button
                  variant="success"
                  onClick={() => navigate("/create-employee")}
                >
                  เพิ่มพนักงาน
                </Button>
              </Col>
            </Row>
          </div>

          {/* Table */}
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              margin: "0 20px 20px",
            }}
          >
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>รหัสพนักงาน</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>อีเมล</th>
                  <th>เบอร์โทรศัพท์</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <Spinner animation="border" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5">
                      <Alert variant="danger">{error}</Alert>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      ไม่พบข้อมูลพนักงาน
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.emp_id || "-"}</td>
                      <td>{employee.user_fullname}</td>
                      <td>{employee.email}</td>
                      <td>{employee.user_phone || "-"}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="warning"
                          className="me-2"
                          onClick={() => navigate(`/update-employee/${employee._id}`)}
                        >
                          <FiEdit /> แก้ไข
                        </Button>
                        <Button size="sm" variant="danger">
                          <FiTrash2 /> ลบ
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

        </Col>
      </Row>
    </Container>
  );
}
