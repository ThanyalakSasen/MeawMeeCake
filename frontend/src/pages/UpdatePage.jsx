import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

import InputDate from "../components/inputDate";
import { InputField } from "../components/InputField";
import { Select } from "../components/select";
import ButtonSubmit from "../components/button";
import loginPicture from "../assets/pictures/LoginRegisterPicture.png";

const allergyOptions = [
  { value: "milk", label: "นม" },
  { value: "eggs", label: "ไข่" },
  { value: "peanuts", label: "ถั่วลิสง" },
  { value: "soy", label: "ถั่วเหลือง" },
  { value: "wheat", label: "ข้าวสาลี / กลูเตน" },
  { value: "fish", label: "ปลา" },
  { value: "shellfish", label: "อาหารทะเล" },
  { value: "nuts", label: "ถั่วต่าง ๆ" },
];

export default function UpdatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [hasAllergies, setHasAllergies] = useState(null);
  const [selectedAllergy, setSelectedAllergy] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [loading, setLoading] = useState(false);

  /* -----------------------------
     1️⃣ รับ token จาก Google callback
  ------------------------------*/
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      console.log("🔐 SAVE TOKEN FROM CALLBACK");
    }
  }, [searchParams]);

  /* -----------------------------
     2️⃣ โหลดข้อมูลผู้ใช้
  ------------------------------*/
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get(
          "http://localhost:3000/api/auth/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("👤 LOAD USER:", res.data.user);

        const user = res.data.user;
        setFullname(user.user_fullname || "");
        setEmail(user.email || "");
        setSelectedAllergies(user.user_allergies || []);
      } catch (err) {
        console.error("❌ LOAD USER ERROR:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  /* -----------------------------
     Allergies handlers
  ------------------------------*/
  const handleHasAllergiesChange = (value) => {
    setHasAllergies(value);
    if (!value) {
      setSelectedAllergies([]);
      setSelectedAllergy("");
    }
  };

  const handleAddAllergy = () => {
    if (selectedAllergy && !selectedAllergies.includes(selectedAllergy)) {
      setSelectedAllergies([...selectedAllergies, selectedAllergy]);
      setSelectedAllergy("");
    }
  };

  const handleRemoveAllergy = (value) => {
    setSelectedAllergies(selectedAllergies.filter((a) => a !== value));
  };
  const getAllergyLabel = (value) => {
    const option = allergyOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  /* -----------------------------
     3️⃣ Submit อัปเดตโปรไฟล์
  ------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !birthdate ||
      !phone ||
      hasAllergies === null ||
      (hasAllergies && selectedAllergies.length === 0)
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        user_birthdate: birthdate,
        user_phone: phone,
        user_allergies: hasAllergies ? selectedAllergies : [],
        profileCompleted: true,
      };

      console.log("📤 UPDATE PAYLOAD:", payload);

      const res = await axios.put(
        "http://localhost:3000/api/auth/complete-profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ UPDATE RESPONSE:", res.data);

      // 🔥 อัปเดต user ใน Context
      setUser(res.data.user);

      navigate("/dashboard");
    } catch (error) {
      console.error("❌ UPDATE ERROR:", error);
      alert(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "เกิดข้อผิดพลาด"
          : "เกิดข้อผิดพลาด"
      );
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     UI
  ------------------------------*/
  return (
    <Container fluid>
      <Row style={{ display: "flex", width: "100%" }}>
        <Col sm={4} style={{ padding: 0 }}>
          <img src={loginPicture} alt="Login" style={{ maxWidth: "100%", height: "auto" }} />
        </Col>

        <Col sm={8} style={{ display: "flex", padding: "0" }}>
          <div style={{
              width: "100%",
              justifyItems: "center",
              alignItems: "center",
              margin: "10% 20%",
            }}>
            <h4 style={{ marginBottom: "24px", fontWeight: "bold" }}>
              อัปเดตข้อมูลผู้ใช้
            </h4>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <InputField label="ชื่อผู้ใช้" value={fullname} disabled />
              <InputField label="อีเมล" value={email} disabled />

              <Row>
                <Col md={6}>
                  <InputDate
                    label="วันเกิด"
                    value={birthdate}
                    onChange={(date) =>
                      setBirthdate(
                        date ? date.toISOString().split("T")[0] : ""
                      )
                    }
                  />
                </Col>

                <Col md={6}>
                  <InputField
                    label="เบอร์โทร"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                    pattern="[0-9]*"
                    required
                  />
                </Col>
              </Row>

              <div style={{ marginBottom: "16px", marginTop: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "12px",
                    fontWeight: "500",
                  }}
                >
                  มีประวัติการแพ้อาหาร / วัตถุดิบหรือไม่
                </label>
                <div style={{ display: "flex", gap: "16px" }}>
                  <Form.Check
                    type="radio"
                    id="has-allergies-yes"
                    name="hasAllergies"
                    label="มี"
                    checked={hasAllergies === true}
                    onChange={() => handleHasAllergiesChange(true)}
                    style={{ cursor: "pointer" }}
                  />
                  <Form.Check
                    type="radio"
                    id="has-allergies-no"
                    name="hasAllergies"
                    label="ไม่มี"
                    checked={hasAllergies === false}
                    onChange={() => handleHasAllergiesChange(false)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>

              {hasAllergies === true && (
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    กรุณาเลือกวัตถุดิบที่แพ้
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-end",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Select
                        options={allergyOptions}
                        value={selectedAllergy}
                        onChange={(e) => setSelectedAllergy(e.target.value)}
                        placeholder="เลือกวัตถุดิบที่แพ้"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAllergy}
                      disabled={!selectedAllergy}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#FBBC05",
                        border: "none",
                        borderRadius: "4px",
                        cursor: selectedAllergy ? "pointer" : "not-allowed",
                        opacity: selectedAllergy ? 1 : 0.6,
                        fontWeight: "500",
                        height: "38px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      เพิ่ม
                    </button>
                  </div>

                  {selectedAllergies.length > 0 && (
                    <div
                      style={{
                        marginTop: "16px",
                        padding: "16px",
                        backgroundColor: "#FFF9E6",
                        borderRadius: "8px",
                        border: "1px solid #FBBC05",
                      }}
                    >
                      <div style={{ fontWeight: "500", marginBottom: "12px" }}>
                        คุณแพ้อาหาร/วัตถุดิบ
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {selectedAllergies.map((allergy) => (
                          <span
                            key={allergy}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "6px 12px",
                              backgroundColor: "white",
                              borderRadius: "16px",
                              border: "1px solid #ddd",
                              fontSize: "14px",
                            }}
                          >
                            {getAllergyLabel(allergy)}
                            <button
                              type="button"
                              onClick={() => handleRemoveAllergy(allergy)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "18px",
                                lineHeight: "1",
                                color: "#666",
                                padding: "0",
                                marginLeft: "4px",
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAllergies.length === 0 && (
                    <div
                      style={{
                        marginTop: "16px",
                        padding: "16px",
                        backgroundColor: "#FFF9E6",
                        borderRadius: "8px",
                        border: "1px solid #FBBC05",
                      }}
                    >
                      <div style={{ fontWeight: "500", marginBottom: "8px" }}>
                        คุณแพ้อาหาร/วัตถุดิบ
                      </div>
                      <div style={{ color: "#666", fontSize: "14px" }}>
                        ยังไม่มีการเลือกอาหาร/วัตถุที่แพ้
                      </div>
                    </div>
                  )}
                </div>
              )}

              <ButtonSubmit
                type="submit"
                textButton="สมัครสมาชิก"
                style={{
                  backgroundColor: "#FBBC05",
                  width: "100%",
                  border: "0px",
                  color: "black",
                  fontWeight: "bold",
                  marginTop: "24px",
                  padding: "12px",
                  borderRadius: "8px",
                }}
                disabled={loading}
              />
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}