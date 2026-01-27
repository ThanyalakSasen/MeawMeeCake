import { useRef, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

function ImageUpload({ image, setImage }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setImage(file); // ส่ง file object กลับไปยัง parent component
  };

  // cleanup object URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Container>
      <Row className="align-items-center">
        <Col xs={6} md={4} className="text-center mx-auto">
          <Image
            src={preview || "https://via.placeholder.com/180"}
            roundedCircle
            width={180}
            height={180}
            className="border shadow-sm object-fit-cover mb-3"
          />
          <br />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
          <Button variant="primary" onClick={handleButtonClick}>
            อัปโหลดรูปภาพ
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ImageUpload;
