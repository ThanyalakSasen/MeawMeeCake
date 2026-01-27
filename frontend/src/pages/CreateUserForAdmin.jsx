import { useState } from "react";
import { InputField } from "../components/InputField";
import InputDate from "../components/inputDate";
import SideBarMenu from "../components/SideBarMenu";
import { SelectInput } from "../components/select";
import ImageUpload from "../components/imageUploadComponent";
import NavBar from "../components/NavBar";
import { Row, Col, Alert, Spinner } from "react-bootstrap";
import api from "../services/api";

export default function CreateUserForAdmin() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setDateOfBirth] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState(null);

  // Employee only
  const [position, setPosition] = useState("");
  const [startWorkDate, setStartWorkDate] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [employeeSalary, setEmployeeSalary] = useState("");
  const [partTimeHours, setPartTimeHours] = useState("");

  const [password, setPassword] = useState("");
  const passwordLength = 6;

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generatePassword = () => {
    const charset = "0123456789abcdefghijklmnopqrstuvwxyz";
    let newPassword = "";

    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }
    setPassword(newPassword);
    setCopyMessage("");
  };

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopyMessage("คัดลอกรหัสผ่านเรียบร้อยแล้ว!");
    setTimeout(() => setCopyMessage(""), 3000);
  };

  const roleOptions = [
    { value: "", label: "กรุณาเลือกบทบาท" },
    { value: "Employee", label: "พนักงาน" },
    { value: "Customer", label: "ลูกค้า" },
  ];

  const positionOptions = [
    { value: "", label: "กรุณาเลือกตำแหน่ง" },
    { value: "", label: "พนักงานครัว" },
    { value: "", label: "พนักงานบริการ" },
    { value: "", label: "ผู้จัดการ" },
    { value: "", label: "แม่บ้าน" },
  ];

  const typeEmployeeOptions = [
    { value: "", label: "กรุณาเลือกประเภทพนักงาน" },
    { value: "Full-time", label: "เต็มเวลา" },
    { value: "Part-time", label: "พาร์ทไทม์" },
  ];

  // ฟังก์ชันแปลงวันที่เป็น ISO format
  const formatDateToISO = (date) => {
    if (!date) return null;
    if (date instanceof Date) {
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    }
    if (typeof date === "string") {
      // ถ้าเป็น dd/mm/yyyy ให้แปลงเป็น YYYY-MM-DD
      if (date.includes("/")) {
        const [day, month, year] = date.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
      return date; // ถ้าเป็น YYYY-MM-DD อยู่แล้ว
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!fullname || !email || !phone || !password || !role) {
      setErrorMessage("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    if (role === "Employee") {
      if (!position || !startWorkDate || !employeeType) {
        setErrorMessage("กรุณากรอกข้อมูลพนักงานให้ครบถ้วน");
        return;
      }

      if (employeeType === "Full-time" && !employeeSalary) {
        setErrorMessage("กรุณากรอกเงินเดือน");
        return;
      }

      if (employeeType === "Part-time" && !partTimeHours) {
        setErrorMessage("กรุณากรอกชั่วโมงทำงาน");
        return;
      }
    }

    try {
      setIsLoading(true);

      // เตรียมข้อมูลสำหรับส่งไป Backend
      const userData = {
        user_fullname: fullname,
        email: email,
        password: password,
        user_phone: phone,
        user_birthdate: formatDateToISO(birthdate),
        role: role,
        authProvider: "local",
        isEmailVerified: true, // Admin สร้างให้ ไม่ต้องยืนยันอีเมล
        profileCompleted: true,
      };

      // ถ้าเป็น Employee ให้เพิ่มข้อมูลพนักงาน
      if (role === "Employee") {
        userData.emp_position = position;
        userData.start_working_date = formatDateToISO(startWorkDate);
        userData.employment_type = employeeType;
        userData.emp_status = "Active";

        if (employeeType === "Full-time") {
          userData.emp_salary = Number(employeeSalary);
        }

        if (employeeType === "Part-time") {
          userData.partTimeHours = Number(partTimeHours);
        }
      }else {
        // Customer
        userData.emp_position = null;
        userData.start_working_date = null;
        userData.employment_type = null;
        userData.emp_salary = null;
        userData.part_time_hours = null;
        userData.emp_status = null;

      }
      

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/auth/admin/create-user",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(
          `เพิ่มผู้ใช้สำเร็จ! รหัสผ่านคือ: ${password} (กรุณาบันทึกไว้)`
        );

        // รีเซ็ตฟอร์ม
        setTimeout(() => {
          setFullname("");
          setEmail("");
          setPhone("");
          setDateOfBirth("");
          setRole("");
          setPosition("");
          setStartWorkDate("");
          setEmployeeType("");
          setEmployeeSalary("");
          setPartTimeHours("");
          setPassword("");
          setSuccessMessage("");
        }, 5000);
      }
    } catch (error) {
      console.error("Create User Error:", error);
      setErrorMessage(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Row>
      <Col md={3} className="p-0">
        <SideBarMenu />
      </Col>

      <Col md={9} style={{ backgroundColor: "#F0F0FA", minHeight: "100vh" }}>
        <NavBar titleMain="เพิ่มผู้ใช้ใหม่" />

        <Row className="m-3">
          <Col md={10} className="w-100">
            <div className="p-4 bg-white rounded">
              <form onSubmit={handleSubmit}>
                {/* ✅ แก้ไข: เพิ่ม onChange handler หรือใช้แบบไม่ควบคุม */}
                <Row className="m-4 align-items-center">
                  <ImageUpload 
                    image={image} 
                    setImage={setImage}
                  />
                </Row>

                <Row>
                  {/* LEFT */}
                  <Col md={6}>
                    <InputField
                      label="ชื่อ-นามสกุล *"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                    />
                    <InputField
                      label="อีเมล *"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputField
                      label="เบอร์โทรศัพท์ *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <InputField
                      label="รหัสผ่าน *"
                      type="text"
                      value={password}
                      //readOnly
                    />

                    <div className="mb-3">
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={generatePassword}
                      >
                        🔐 สร้างรหัสผ่าน
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={copyToClipboard}
                        disabled={!password}
                      >
                        📋 คัดลอก
                      </button>
                    </div>

                    {copyMessage && (
                      <Alert variant="success">{copyMessage}</Alert>
                    )}

                    <InputDate
                      label="วันเกิด"
                      value={birthdate}
                      onChange={(value) => setDateOfBirth(value)}
                    />
                  </Col>

                  {/* RIGHT */}
                  <Col md={6}>
                    <SelectInput
                      label="บทบาท *"
                      options={roleOptions}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    {role === "Employee" && (
                      <>
                        <SelectInput
                          label="ตำแหน่งงาน *"
                          options={positionOptions}
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                        />
                        <InputDate
                          label="วันที่เริ่มงาน *"
                          value={startWorkDate}
                          onChange={(value) => setStartWorkDate(value)}
                        />
                        <SelectInput
                          label="ประเภทพนักงาน *"
                          options={typeEmployeeOptions}
                          value={employeeType}
                          onChange={(e) => setEmployeeType(e.target.value)}
                        />

                        {employeeType === "Full-time" && (
                          <InputField
                            label="เงินเดือน *"
                            type="number"
                            value={employeeSalary}
                            onChange={(e) => setEmployeeSalary(e.target.value)}
                          />
                        )}

                        {employeeType === "Part-time" && (
                          <InputField
                            label="ชั่วโมงทำงานต่อวัน *"
                            type="number"
                            value={partTimeHours}
                            onChange={(e) => setPartTimeHours(e.target.value)}
                          />
                        )}
                      </>
                    )}
                  </Col>
                </Row>

                {/* แสดงข้อความสำเร็จหรือผิดพลาด */}
                {successMessage && (
                  <Alert variant="success" className="mt-3">
                    {successMessage}
                  </Alert>
                )}
                {errorMessage && (
                  <Alert variant="danger" className="mt-3">
                    {errorMessage}
                  </Alert>
                )}

                <div className="text-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        กำลังบันทึก...
                      </>
                    ) : (
                      "บันทึกข้อมูล"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}