import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authAPI from "../services/authService";
import { InputField } from "../components/InputField";
import InputDate from "../components/inputDate";
import { SelectInput } from "../components/select";
import ButtonSubmit from "../components/button";
import axios from "axios";
import { Col, Container, Row, Form } from "react-bootstrap";
import loginPicture from "../assets/pictures/LoginRegisterPicture.png";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterWithGoogle = location.state?.isRegisterWithGoogle;
  const googleId = location.state?.googleId || "";

  // State สำหรับข้อมูลผู้ใช้
  const [fullname, setFullname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  // State สำหรับอาการแพ้
  const [hasAllergies, setHasAllergies] = useState(null);
  const [selectedAllergy, setSelectedAllergy] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  
  // State สำหรับ UI
  const [loading, setLoading] = useState(false);
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

useEffect(() => {
  const fetchIngredients = async () => {
    try {
      setLoadingIngredients(true);
      console.log('🚀 Starting fetch ingredients...');
      
      const url = 'http://localhost:3000/api/ingredients';
      console.log('📍 Fetching from:', url);
      
      const response = await axios.get(url);
      
      console.log('✅ Response received:', response);
      console.log('📦 Response status:', response.status);
      console.log('📋 Response data:', response.data);
      console.log('🔍 Success flag:', response.data?.success);
      console.log('🗂️ Data array:', response.data?.data);
      
      if (response.data && response.data.success && response.data.data) {
        console.log('✨ Processing ingredients...');
        
        const formattedOptions = response.data.data.map((ingredient) => {
          console.log('🔧 Formatting:', ingredient);
          return {
            value: ingredient._id,
            label: ingredient.ingredient_name
          };
        });
        
        console.log('✅ Formatted options:', formattedOptions);
        setAllergyOptions(formattedOptions);
        console.log('💾 State updated!');
      } else {
        console.warn('⚠️ Response structure unexpected:', response.data);
      }
    } catch (error) {
      console.error('❌ Error fetching ingredients:', error);
      console.error('📛 Error message:', error.message);
      console.error('🔴 Error response:', error.response?.data);
      console.error('📊 Error status:', error.response?.status);
      
      // ถ้าดึงข้อมูลไม่สำเร็จ ให้ใช้ข้อมูลสำรอง
      console.log('🔄 Using fallback data...');
      setAllergyOptions([
        { value: "milk", label: "นม" },
        { value: "eggs", label: "ไข่" },
        { value: "peanuts", label: "ถั่วลิสง" },
        { value: "soy", label: "ถั่วเหลือง" },
        { value: "wheat", label: "ข้าวสาลี/กลูเตน" },
        { value: "fish", label: "ปลา" },
        { value: "shellfish", label: "อาหารทะเล" },
        { value: "nuts", label: "ถั่วต่างๆ" },
      ]);
    } finally {
      setLoadingIngredients(false);
      console.log('🏁 Fetch complete');
    }
  };

  fetchIngredients();
}, []);

  const handleHasAllergiesChange = (value) => {
    setHasAllergies(value);
    if (value === false) {
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

  const handleRemoveAllergy = (allergyValue) => {
    setSelectedAllergies(selectedAllergies.filter((a) => a !== allergyValue));
  };

  const getAllergyLabel = (value) => {
    const option = allergyOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.register({
        user_fullname: fullname,
        email: email,
        password: password,
        user_phone: phone,
        user_birthdate: birthdate,
        user_allergies: selectedAllergies,
        ...(googleId && { googleId: googleId }),
      });

      console.log("สมัครสำเร็จด้วย Local (provider: 'local')", response.data);
      alert("สมัครสมาชิกเรียบร้อย กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ");
      navigate("/verify-email");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก";
        alert(message);
        console.log("สมัครไม่สำเร็จ:", message);
        console.error("Error details:", error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row style={{ display: "flex", width: "100%" }}>
        <Col sm={4} style={{ padding: 0 }}>
          <img
            src={loginPicture}
            alt="Login"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Col>
        <Col sm={8} style={{ display: "flex", padding: "0" }}>
          <div
            style={{
              width: "100%",
              justifyItems: "center",
              alignItems: "center",
              margin: "10% 20%",
            }}
          >
            <h4 style={{ marginBottom: "24px", fontWeight: "bold" }}>
              สมัครสมาชิก
            </h4>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <InputField
                label="ชื่อผู้ใช้งาน"
                placeholder="ชื่อ - นามสกุล"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
              <InputField
                label="อีเมล"
                placeholder="อีเมล"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {!isRegisterWithGoogle ? (
                <>
                  <InputField
                    label="รหัสผ่าน"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p style={{ fontSize: "12px", color: "red" }}>
                    กรุณากรอกรหัสผ่านอย่างน้อย 6 ตัวอักษรขึ้นไป
                  </p>
                </>
              ) : null}
              
              <Row>
                <Col md={6}>
                  <InputDate
                    label="วันเกิด"
                    value={birthdate}
                    onChange={(value) =>
                      setBirthdate(
                        value ? value.toISOString().split("T")[0] : ""
                      )
                    }
                    required
                  />
                </Col>

                <Col md={6}>
                  <InputField
                    label="เบอร์โทรติดต่อ"
                    placeholder="0801234567"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    maxLength={10}
                    pattern="[0-9]*"
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
                      <SelectInput
                        options={allergyOptions}
                        value={selectedAllergy}
                        onChange={(e) => setSelectedAllergy(e.target.value)}
                        placeholder={loadingIngredients ? "กำลังโหลด..." : "เลือกวัตถุดิบที่แพ้"}
                        disabled={loadingIngredients}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAllergy}
                      disabled={!selectedAllergy || loadingIngredients}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#FBBC05",
                        border: "none",
                        borderRadius: "4px",
                        cursor: selectedAllergy && !loadingIngredients ? "pointer" : "not-allowed",
                        opacity: selectedAllergy && !loadingIngredients ? 1 : 0.6,
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