import React, { forwardRef } from "react";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* Custom input สำหรับ react-datepicker ให้ editable */
const CustomInput = forwardRef(
  ({ value, onClick, onChange, placeholder, id, name }, ref) => (
    <Form.Control
      ref={ref}
      value={value || ""}
      onClick={onClick}      // เปิด datepicker
      onChange={onChange}    // ทำให้ user พิมพ์เองได้
      placeholder={placeholder}
      id={id}
      name={name}
      className="w-100"
      
    />
  )
);

const InputDate = ({ label, value, onChange, required = false }) => {
  // แปลง value เป็น Date object ถ้าเป็น string
  const parseSelected = () => {
    if (!value) return null;
    if (value instanceof Date) return value;
    return new Date(value + "T00:00:00"); // YYYY-MM-DD
  };

  // ฟังก์ชัน onChange ของ DatePicker จะส่ง date เป็น object
  // ฟังก์ชัน onChange ของ input จะส่ง event
  const handleChange = (dateOrEvent) => {
    if (dateOrEvent instanceof Date || dateOrEvent === null) {
      onChange(dateOrEvent);
    } else if (dateOrEvent?.target) {
      const typedValue = dateOrEvent.target.value;
      onChange(typedValue);
    }
  };

  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
          {label}
        </Form.Label>
      )}

      <DatePicker
        selected={parseSelected()}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/mm/yyyy"
        required={required}
        customInput={<CustomInput />}
        maxDate={new Date()}
        isClearable
        // ให้ user พิมพ์เองได้
        allowSameDay
      />
    </Form.Group>
  );
};

export default InputDate;
