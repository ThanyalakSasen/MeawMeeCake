import { useState } from "react";
import { InputField } from "../components/InputField";
import InputDate from "../components/inputDate";
import SideBarMenu from "../components/SideBarMenu";
import { SelectInput } from "../components/select";
import NavBar from "../components/NavBar";
import { Row, Col } from "react-bootstrap";

export default function CreateUserForAdmin() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setDateOfBirth] = useState("");
  const [role, setRole] = useState("");
  const [position, setPosition] = useState("");
  const [startWorkDate, setStartWorkDate] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [employeeSalary, setEmployeeSalary] = useState("");

  const [password, setPassword] = useState("");
  const [passwordLength] = useState(6);
  const [useNumbers] = useState(true);
  const [useLowercase] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const generatePassword = () => {
    let charset = "";
    let newPassword = "";

    if (useNumbers) charset += "0123456789";
    if (useLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (!charset) return;

    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(newPassword);
  };

  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setSuccessMessage("คัดลอกรหัสผ่านเรียบร้อยแล้ว!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      console.log(error);
      setSuccessMessage("เกิดข้อผิดพลาดในการคัดลอก");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  const positionOptions = [
    { value: "พนักงานครัว", label: "พนักงานครัว" },
    { value: "พนักงานบริการ", label: "พนักงานบริการ" },
    { value: "ผู้จัดการ", label: "ผู้จัดการ" },
    { value: "แม่บ้าน", label: "แม่บ้าน" },
  ];

  const roleOptions = [
    { value: "Employee", label: "พนักงาน" },
    { value: "Customer", label: "ลูกค้า" },
  ];

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ตรวจสอบข้อมูลก่อนส่ง
    if (!fullname || !email || !phone || !password || !role) {
      setSuccessMessage("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    // ส่งข้อมูลไปยัง API หรือ backend
    const userData = {
      fullname,
      email,
      phone,
      birthdate,
      role,
      position,
      startWorkDate,
      employeeType,
      employeeSalary,
      password,
    };

    console.log("User Data:", userData);
    
    // TODO: เรียก API เพื่อบันทึกข้อมูล
    // Example: await createUser(userData);
    
    setSuccessMessage("เพิ่มผู้ใช้สำเร็จ!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <Row>
      <Col md={2}>
        <SideBarMenu />
      </Col>

      <Col md={10} style={{ backgroundColor: "#F0F0FA", minHeight: "100vh" }}>
        <Row>
          <div className="p-3">
            <NavBar titleMain="เพิ่มผู้ใช้ใหม่" />
          </div>
        </Row>
        
        <Row>
          <Col md={8} className="mx-auto mb-4">
            <div className="p-4 bg-white rounded">
              <form onSubmit={handleSubmit}>
                <InputField
                  label="ชื่อ-นามสกุล *"
                  placeholder="กรอกชื่อ-นามสกุล"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />

                <InputField
                  label="อีเมล *"
                  placeholder="กรอกอีเมล"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <InputField
                  label="เบอร์โทรศัพท์ *"
                  placeholder="กรอกเบอร์โทรศัพท์"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <InputField
                  label="รหัสผ่าน *"
                  type="text"
                  value={password}
                  readOnly
                  required
                />

                <div className="mt-3 mb-3">
                  <button 
                    type="button"
                    onClick={generatePassword} 
                    className="me-2 btn btn-primary"
                  >
                    🔐 สร้างรหัสผ่านอัตโนมัติ
                  </button>

                  <button 
                    type="button"
                    onClick={copyToClipboard} 
                    disabled={!password}
                    className="btn btn-secondary"
                  >
                    📋 คัดลอกรหัสผ่าน
                  </button>
                </div>

                <InputDate
                  label="วันเกิด"
                  value={birthdate}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />

                <SelectInput
                  options={roleOptions}
                  value={role}
                  placeholder="เลือกบทบาท"
                  label="บทบาท *"
                  onChange={handleRoleChange}
                  disabled={false}
                  required
                />

                {role === "Employee" && (
                  <>
                    <SelectInput
                      options={positionOptions}
                      value={position}
                      placeholder="เลือกตำแหน่งงาน"
                      label="ตำแหน่งงาน"
                      onChange={(e) => setPosition(e.target.value)}
                      disabled={false}
                    />

                    <InputDate
                      label="วันที่เริ่มงาน"
                      value={startWorkDate}
                      onChange={(e) => setStartWorkDate(e.target.value)}
                    />

                    <InputField
                      label="ประเภทพนักงาน"
                      placeholder="กรอกประเภทพนักงาน (เช่น เต็มเวลา, พาร์ทไทม์)"
                      value={employeeType}
                      onChange={(e) => setEmployeeType(e.target.value)}
                    />

                    <InputField
                      label="เงินเดือน"
                      placeholder="กรอกเงินเดือน"
                      type="number"
                      value={employeeSalary}
                      onChange={(e) => setEmployeeSalary(e.target.value)}
                    />
                  </>
                )}

                {successMessage && (
                  <div className={`alert ${successMessage.includes("สำเร็จ") || successMessage.includes("คัดลอก") ? "alert-success" : "alert-danger"} mt-3`}>
                    {successMessage}
                  </div>
                )}

                <div className="mt-4 text-end">
                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg"
                  >
                    บันทึกข้อมูล
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