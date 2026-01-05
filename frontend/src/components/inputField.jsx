import Form from "react-bootstrap/Form";

export const InputField = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
  maxLength,
  pattern,
  name,
}) => {
  return (
    <Form.Group className="mb-3 w-100" controlId={name}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        pattern={pattern}
        name={name}
      />
    </Form.Group>
  );
};