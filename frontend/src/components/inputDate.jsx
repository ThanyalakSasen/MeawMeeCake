import React, { forwardRef } from "react";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* Custom input สำหรับ react-datepicker */
const CustomInput = forwardRef(
    ({ value, onClick, placeholder, id, name }, ref) => (
        <Form.Control
            ref={ref}
            value={value || ""}
            onClick={onClick}
            placeholder={placeholder}
            id={id}
            name={name}
            className="w-100"
            readOnly
        />
    )
);

const InputDate = ({ label, value, onChange, required = false }) => {
    const parseSelected = () => {
        if (!value) return null;
        if (value instanceof Date) return value;
        return new Date(value + "T00:00:00"); // YYYY-MM-DD
    };

    return (
        <Form className="w-100">
            <Form.Group className="mb-3">
                {label && (
                    <Form.Label
                        style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
                    >
                        {label}
                    </Form.Label>
                )}

                <DatePicker
                    selected={parseSelected()}
                    onChange={onChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    required={required}
                    customInput={<CustomInput />}
                    maxDate={new Date()}
                    isClearable
                />
            </Form.Group>
        </Form>
    );
};

export default InputDate;