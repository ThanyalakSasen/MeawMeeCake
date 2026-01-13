import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import authAPI from '../services/authService';

function CompleteProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    user_phone: '',
    user_birthdate: '',
    user_allergies: []
  });

  useEffect(() => {
    // รับ token จาก URL และเก็บใน localStorage
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
    } else {
      // ถ้าไม่มี token ให้กลับไปหน้า login
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergiesChange = (e) => {
    const allergies = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      user_allergies: allergies
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // ✅ เรียก API complete-profile
      const response = await authAPI.completeProfile(formData);
      
      if (response.success) {
        setSuccess('บันทึกข้อมูลสำเร็จ! กำลังพาคุณไปหน้า Dashboard...');
        
        // เก็บข้อมูล user ใน localStorage
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        // ✅ รอ 1.5 วินาที แล้วไปหน้า Dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      fluid 
      style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px"
      }}
    >
      <Card style={{ maxWidth: "500px", width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Card.Body style={{ padding: "40px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎂</div>
            <h2 style={{ fontWeight: "bold", marginBottom: "8px" }}>กรอกข้อมูลเพิ่มเติม</h2>
            <p style={{ color: "#666", fontSize: "14px" }}>
              กรุณากรอกข้อมูลเพื่อเริ่มใช้งานระบบ
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert variant="success">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>✓</span>
                <span>{success}</span>
              </div>
            </Alert>
          )}

          {/* Form */}
          <Form onSubmit={handleSubmit}>
            {/* เบอร์โทร */}
            <Form.Group className="mb-3" controlId="user_phone">
              <Form.Label>
                เบอร์โทรศัพท์ <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="tel"
                name="user_phone"
                value={formData.user_phone}
                onChange={handleChange}
                placeholder="0812345678"
                required
                disabled={loading}
              />
            </Form.Group>

            {/* วันเกิด */}
            <Form.Group className="mb-3" controlId="user_birthdate">
              <Form.Label>
                วันเกิด <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="user_birthdate"
                value={formData.user_birthdate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>

            {/* อาการแพ้ */}
            <Form.Group className="mb-4" controlId="user_allergies">
              <Form.Label>อาการแพ้ (ถ้ามี)</Form.Label>
              <Form.Control
                type="text"
                onChange={handleAllergiesChange}
                placeholder="ใส่แยกด้วยเครื่องหมายจุลภาค (เช่น ถั่ว, กุ้ง, นม)"
                disabled={loading}
              />
              <Form.Text className="text-muted">
                หากมีหลายอย่าง ให้คั่นด้วยเครื่องหมายจุลภาค (,)
              </Form.Text>
            </Form.Group>

            {/* Submit Button */}
            <Button
              variant="warning"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                fontWeight: "600",
                fontSize: "16px",
                backgroundColor: "#FBBC05",
                border: "none"
              }}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    style={{ marginRight: "8px" }}
                  />
                  กำลังบันทึก...
                </>
              ) : (
                'บันทึกข้อมูล'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CompleteProfile;