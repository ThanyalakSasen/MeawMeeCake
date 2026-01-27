import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";


const ButtonSubmit = ({ textButton, type, onClick, disabled, style }) => {
    return (
        <Button
            type={type}
            style={style}
            onClick={onClick}
            disabled={disabled}
        >
            {textButton}
        </Button>
    );
};


export default ButtonSubmit;