import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";
import InputDate from "./inputDate";
import Select from "./select";
import ButtonSubmit from "./button";
import axios from "axios";
import { Col, Container, Row, Form } from "react-bootstrap";
import loginPicture from "../assets/loginPicture/LoginRegisterPicture4.png";

// ตัวอย่างรายการวัตถุดิบที่อาจแพ้
const allergyOptions = [
    { value: "milk", label: "นม" },
    { value: "eggs", label: "ไข่" },
    { value: "peanuts", label: "ถั่วลิสง" },
    { value: "soy", label: "ถั่วเหลือง" },
    { value: "wheat", label: "ข้าวสาลี/กลูเตน" },
    { value: "fish", label: "ปลา" },
    { value: "shellfish", label: "อาหารทะเล" },
    { value: "nuts", label: "ถั่วต่างๆ" },
];

export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();

    const [fullname, setFullname] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [hasAllergies, setHasAllergies] = useState(null);
    const [selectedAllergy, setSelectedAllergy] = useState("");
    const [selectedAllergies, setSelectedAllergies] = useState([]);
    const [loading, setLoading] = useState(false);

    const isRegisterWithGoogle = location.state?.isRegisterWithGoogle;

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
        setSelectedAllergies(
            selectedAllergies.filter((a) => a !== allergyValue)
        );
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
                email,
                password,
                fullname,
                phone,
                birthdate: birthdate || undefined,
                allergies: selectedAllergies,
            });

            console.log("สมัครสำเร็จ", response.data);
            alert("สมัครสมาชิกเรียบร้อย กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ");
            navigate("/verify-email");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    "เกิดข้อผิดพลาดในการสมัครสมาชิก";
                alert(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid>
            <Row style={{ width: "100%" }}>
                <Col sm={4} style={{ padding: 0 }}>
                    <img
                        src={loginPicture}
                        alt="Login"
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                </Col>

                <Col sm={8} style={{ padding: 0 }}>
                    <div style={{ margin: "10% 20%" }}>
                        <h4 style={{ marginBottom: "24px", fontWeight: "bold" }}>
                            สมัครสมาชิก
                        </h4>

                        <form onSubmit={handleSubmit}>
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
                                placeholder="example@gmail.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            {!isRegisterWithGoogle && (
                                <InputField
                                    label="รหัสผ่าน"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            )}

                            <InputDate
                                label="วันเกิด"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                required
                            />

                            <InputField
                                label="เบอร์โทรติดต่อ"
                                placeholder="0801234567"
                                type="text"
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                maxLength={10}
                                pattern="[0-9]*"
                            />

                            <div style={{ marginTop: "24px" }}>
                                <label style={{ fontWeight: "500" }}>
                                    มีประวัติการแพ้อาหาร / วัตถุดิบหรือไม่
                                </label>

                                <div style={{ display: "flex", gap: "16px" }}>
                                    <Form.Check
                                        type="radio"
                                        label="มี"
                                        checked={hasAllergies === true}
                                        onChange={() =>
                                            handleHasAllergiesChange(true)
                                        }
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="ไม่มี"
                                        checked={hasAllergies === false}
                                        onChange={() =>
                                            handleHasAllergiesChange(false)
                                        }
                                    />
                                </div>
                            </div>

                            {hasAllergies === true && (
                                <div style={{ marginTop: "16px" }}>
                                    <Select
                                        options={allergyOptions}
                                        value={selectedAllergy}
                                        onChange={(e) =>
                                            setSelectedAllergy(e.target.value)
                                        }
                                        placeholder="เลือกวัตถุดิบที่แพ้"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleAddAllergy}
                                        disabled={!selectedAllergy}
                                    >
                                        เพิ่ม
                                    </button>

                                    {selectedAllergies.map((allergy) => (
                                        <div key={allergy}>
                                            {getAllergyLabel(allergy)}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveAllergy(allergy)
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <ButtonSubmit
                                type="submit"
                                textButton="สมัครสมาชิก"
                                disabled={loading}
                                style={{
                                    backgroundColor: "#FBBC05",
                                    width: "100%",
                                    marginTop: "24px",
                                }}
                            />
                        </form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}