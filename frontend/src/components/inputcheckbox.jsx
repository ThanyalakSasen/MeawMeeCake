import Form from "react-bootstrap/Form";


const InputCheckbox = (props) => {
    const { label, value, onChange, required } = props;

    return (
        <Form style={{ width: "100%" }}>
            <Form.Check
                type="checkbox"
                id={value || "default-checkbox"}
                label={label || "default checkbox"}
                value={value}
                onChange={onChange}
                required={required}
            />
        </Form>
    );
};

export default InputCheckbox;
