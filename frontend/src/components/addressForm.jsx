import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { SelectInput } from "./../components/select";

// ข้อมูลที่อยู่ไทยแบบเต็ม (สามารถขยายเพิ่มได้)
const thailandAddressData = {
  กรุงเทพมหานคร: {
    บางรัก: {
      subDistricts: ["สีลม", "สุริยวงศ์", "บางรัก", "สี่พระยา"],
      postalCode: "10500"
    },
    ปทุมวัน: {
      subDistricts: ["ปทุมวัน", "ลุมพินี", "รองเมือง", "วังใหม่"],
      postalCode: "10330"
    },
    พระโขนง: {
      subDistricts: ["บางจาก", "พระโขนง"],
      postalCode: "10260"
    }
  },
  เชียงใหม่: {
    เมืองเชียงใหม่: {
      subDistricts: ["ศรีภูมิ", "พระสิงห์", "หายยา", "ช้างม่อย"],
      postalCode: "50000"
    },
    สันทราย: {
      subDistricts: ["สันทรายหลวง", "สันทรายน้อย", "สันพระเนตร"],
      postalCode: "50210"
    },
    แม่ริม: {
      subDistricts: ["ริมใต้", "ริมเหนือ", "สันโป่ง"],
      postalCode: "50180"
    }
  },
  ขอนแก่น: {
    เมืองขอนแก่น: {
      subDistricts: ["ในเมือง", "บ้านค้อ", "บ้านเป็ด", "สำราญ"],
      postalCode: "40000"
    },
    บ้านไผ่: {
      subDistricts: ["บ้านไผ่", "หนองน้ำใส", "เมืองเพีย"],
      postalCode: "40110"
    }
  },
  มหาสารคาม: {
    เมืองมหาสารคาม: {
      subDistricts: ["ตลาด", "ท่าตูม", "เขวา", "แวงน่าง"],
      postalCode: "44000"
    },
    กันทรวิชัย: {
      subDistricts: ["กันทรวิชัย", "ขามป้อม", "ท่าขอนยาง"],
      postalCode: "44150"
    }
  },
  ภูเก็ต: {
    เมืองภูเก็ต: {
      subDistricts: ["ตลาดใหญ่", "ตลาดเหนือ", "รัษฎา", "วิชิต"],
      postalCode: "83000"
    },
    กะทู้: {
      subDistricts: ["กะทู้", "ป่าตอง", "กมลา"],
      postalCode: "83120"
    }
  },
  เชียงราย: {
    เมืองเชียงราย: {
      subDistricts: ["เวียง", "รอบเวียง", "แม่ยาว"],
      postalCode: "57000"
    }
  },
  นครราชสีมา: {
    เมืองนครราชสีมา: {
      subDistricts: ["ในเมือง", "โพธิ์กลาง", "หนองไผ่ล้อม"],
      postalCode: "30000"
    }
  },
  สงขลา: {
    เมืองสงขลา: {
      subDistricts: ["บ่อยาง", "เขารูปช้าง", "พะวง"],
      postalCode: "90000"
    },
    หาดใหญ่: {
      subDistricts: ["หาดใหญ่", "คูเต่า", "คอหงส์"],
      postalCode: "90110"
    }
  }
};

export default function AddressForm({ 
  address, 
  onChange, 
  showLabel = true,
  required = false 
}) {
  const [localAddress, setLocalAddress] = useState({
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    subDistrict: address?.subDistrict || "",
    district: address?.district || "",
    province: address?.province || "",
    postalCode: address?.postalCode || "",
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);

  // โหลดจังหวัดทั้งหมด
  useEffect(() => {
    const provinceList = Object.keys(thailandAddressData).map(province => ({
      value: province,
      label: province
    }));
    setProvinces(provinceList);
  }, []);

  // โหลดอำเภอเมื่อเลือกจังหวัด
  useEffect(() => {
    if (localAddress.province) {
      const districtList = Object.keys(thailandAddressData[localAddress.province] || {}).map(district => ({
        value: district,
        label: district
      }));
      setDistricts(districtList);
    } else {
      setDistricts([]);
      setSubDistricts([]);
    }
  }, [localAddress.province]);

  // โหลดตำบลเมื่อเลือกอำเภอ
  useEffect(() => {
    if (localAddress.province && localAddress.district) {
      const districtData = thailandAddressData[localAddress.province]?.[localAddress.district];
      if (districtData) {
        const subDistrictList = districtData.subDistricts.map(subDistrict => ({
          value: subDistrict,
          label: subDistrict,
          zipCode: districtData.postalCode
        }));
        setSubDistricts(subDistrictList);
      }
    } else {
      setSubDistricts([]);
    }
  }, [localAddress.province, localAddress.district]);

  const handleChange = (field, value) => {
    const newAddress = { ...localAddress, [field]: value };
    
    // รีเซ็ตค่าที่เกี่ยวข้องเมื่อเปลี่ยนจังหวัด
    if (field === "province") {
      newAddress.district = "";
      newAddress.subDistrict = "";
      newAddress.postalCode = "";
    }
    
    // รีเซ็ตตำบลเมื่อเปลี่ยนอำเภอ
    if (field === "district") {
      newAddress.subDistrict = "";
      newAddress.postalCode = "";
    }
    
    // Auto-fill รหัสไปรษณีย์เมื่อเลือกตำบล
    if (field === "subDistrict" && value && localAddress.province && localAddress.district) {
      const districtData = thailandAddressData[localAddress.province]?.[localAddress.district];
      if (districtData) {
        newAddress.postalCode = districtData.postalCode;
      }
    }
    
    setLocalAddress(newAddress);
    if (onChange) {
      onChange(newAddress);
    }
  };

  return (
    <div className="address-form">
      {showLabel && (
        <h5 className="mb-3" style={{ fontWeight: "600" }}>
          ที่อยู่สำหรับจัดส่ง {required && <span className="text-danger">*</span>}
        </h5>
      )}

      <InputField
        label="ที่อยู่ (บ้านเลขที่, หมู่, ซอย, ถนน)"
        placeholder="เช่น 123 หมู่ 5 ซอยสุขุมวิท 21"
        value={localAddress.addressLine1}
        onChange={(e) => handleChange("addressLine1", e.target.value)}
        required={required}
      />

      <InputField
        label="ที่อยู่เพิ่มเติม (อาคาร, ชั้น, ห้อง)"
        placeholder="เช่น อาคาร ABC ชั้น 5 ห้อง 501 (ถ้ามี)"
        value={localAddress.addressLine2}
        onChange={(e) => handleChange("addressLine2", e.target.value)}
      />

      <Row>
        <Col md={6}>
          <SelectInput
            label="จังหวัด"
            options={provinces}
            value={localAddress.province}
            onChange={(e) => handleChange("province", e.target.value)}
            placeholder="เลือกจังหวัด"
            required={required}
          />
        </Col>

        <Col md={6}>
          <SelectInput
            label="อำเภอ/เขต"
            options={districts}
            value={localAddress.district}
            onChange={(e) => handleChange("district", e.target.value)}
            placeholder={!localAddress.province ? "กรุณาเลือกจังหวัดก่อน" : "เลือกอำเภอ/เขต"}
            disabled={!localAddress.province}
            required={required}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <SelectInput
            label="ตำบล/แขวง"
            options={subDistricts}
            value={localAddress.subDistrict}
            onChange={(e) => handleChange("subDistrict", e.target.value)}
            placeholder={!localAddress.district ? "กรุณาเลือกอำเภอก่อน" : "เลือกตำบล/แขวง"}
            disabled={!localAddress.district}
            required={required}
          />
        </Col>

        <Col md={6}>
          <InputField
            label="รหัสไปรษณีย์"
            placeholder="เช่น 10110"
            value={localAddress.postalCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 5);
              handleChange("postalCode", value);
            }}
            maxLength={5}
            required={required}
          />
        </Col>
      </Row>

      {localAddress.addressLine1 && localAddress.province && (
        <div className="mt-3 p-3 rounded" style={{ backgroundColor: "#F0F9FF", border: "1px solid #BAE6FD" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "18px", marginRight: "8px" }}>📍</span>
            <strong style={{ color: "#0369A1" }}>ที่อยู่สำหรับจัดส่ง</strong>
          </div>
          <p className="mb-0" style={{ lineHeight: "1.6", color: "#0C4A6E" }}>
            {localAddress.addressLine1}
            {localAddress.addressLine2 && ` ${localAddress.addressLine2}`}
            <br />
            {localAddress.subDistrict && `ตำบล/แขวง${localAddress.subDistrict} `}
            {localAddress.district && `อำเภอ/เขต${localAddress.district} `}
            <br />
            {localAddress.province && `จังหวัด${localAddress.province} `}
            {localAddress.postalCode && `${localAddress.postalCode}`}
          </p>
        </div>
      )}
    </div>
  );
}