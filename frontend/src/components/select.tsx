import Form from "react-bootstrap/Form";

interface SelectProps {
    label?: string;
    name?: string;
    options: Array<{ value: string; label: string }>;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
}

export const Select = ({
    label,
    name,
    options,
    value,
    onChange,
    placeholder,
    required = false,
    className,
    disabled = false,
}: SelectProps) => {
    return (
        <div style={{ width: "100%", marginBottom: label ? "16px" : "0" }} className={className}>
            {label && <Form.Label style={{ display: "block", marginBottom: "8px" }}>{label}</Form.Label>}
            <Form.Select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Form.Select>
        </div>
    );
};
