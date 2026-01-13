import Form from "react-bootstrap/Form";

export default function InputCheckbox({ label, checked, onChange }) {
  return (
    <div className="mb-3">
      <Form.Check
        type="checkbox"
        label={label}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}
