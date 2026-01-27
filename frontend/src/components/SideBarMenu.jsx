import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import logoMaewMeeCake from "../assets/pictures/logoMaewMeeCake.png";
import { FiMenu } from "react-icons/fi";
import "./SideBar.css";

function SideBarMenu() {
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = () => setShow(!show);
  const toggleMenu = (index) =>
    setOpenIndex(openIndex === index ? null : index);


  const ListSideBarMenu = [
    {
      name: "รายงานยอดขาย/การวิเคราะห์ความคิดเห็น",
      subMenu: [
        { name: "รายงานยอดขาย", link: "/sales-reports" },
        { name: "ผลการวิเคราะห์ความคิดเห็น", link: "/feedback-analysis" },
      ],
    },
    {
      name: "จัดการสินค้า",
      subMenu: [
        { name: "รายการสินค้า", link: "/add-product" },
        { name: "สต็อกสินค้า", link: "/stock-products" },
        { name: "ประวัติการสต็อกสินค้า", link: "/product-stock-history" },
      ],
    },
    {
      name: "จัดการสินค้าพรีออเดอร์",
      subMenu: [
        { name: "รายการสินค้าพรีออเดอร์", link: "/add-product-preorder" },
        { name: "สถานะการผลิตสินค้าพรีออเดอร์", link: "/stock-products-preorder" },
        { name: "ประวัติการสต็อกสินค้าพรีออเดอร์", link: "/product-preorder-stock-history" },
      ],
    },
    {
      name: "จัดการคำสั่งซื้อ",
      subMenu: [
        { name: "คำสั่งซื้อทั้งหมด", link: "/all-orders" },
        { name: "การจัดส่งออเดอร์", link: "/shipped-orders" },
        { name: "ประวัติคำสั่งซื้อ", link: "/order-history" },
      ],
    },
    {
      name: "จัดการวัตถุดิบ",
      subMenu: [
        { name: "รายการวัตถุดิบ", link: "/ingredient-list" },
        { name: "ฟอร์มรับวัตถุดิบใหม่", link: "/add-ingredient" },
        { name: "ประวัติการรับวัตถุดิบ", link: "/ingredient-receive-history" },
      ],
    },
    {
      name: "จัดการสูตร",
      link: "/manage-recipes",
    },
    {
      name: "จัดการพนักงาน",
      subMenu: [
        { name: "รายชื่อพนักงาน", link: "/employeeManage" },
        { name: "จัดการสิทธิ์พนักงาน", link: "/manage-employee-permissions" },
        { name: "ตารางเวร/กะทำงาน", link: "/employee-schedule" },
      ],
    },
    {
      name: "การออกแบบเว็บไซต์",
      link: "/store-settings",
    },
  ];

  // ตรวจสอบขนาดหน้าจอ
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MenuContent = () => (
  <Nav className="flex-column sidebar-menu">
    {ListSideBarMenu.map((item, index) => {
      const isOpen = openIndex === index;

      return (
        <div key={index} className="sidebar-item">
          <div
            className={`sidebar-item-header ${isOpen ? "active" : ""}`}
            onClick={() => item.subMenu && toggleMenu(index)}
          >
            <span className="sidebar-item-title">
              {item.name}
            </span>

            {item.subMenu && (
              <span className={`chevron ${isOpen ? "rotate" : ""}`}>
                ▾
              </span>
            )}
          </div>

          {item.subMenu && isOpen && (
            <div className="sidebar-submenu">
              {item.subMenu.map((sub, i) => (
                <Nav.Link
                  key={i}
                  href={sub.link}
                  className="sidebar-submenu-item"
                  onClick={() => setShow(false)}
                >
                  {sub.name}
                </Nav.Link>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </Nav>
);


  return (
    <>
      {/* ปุ่มเมนู (Mobile) */}
      {isMobile && (
        <Button
          variant="light"
          onClick={handleToggle}
          style={{ fontSize: "22px", border: "none" }}
        >
          <FiMenu />
        </Button>
      )}

      {/* Offcanvas (Mobile) */}
      <Offcanvas show={show} onHide={handleToggle} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <MenuContent/>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Sidebar (Desktop) */}
      {!isMobile && (
        <div style={{ background: "#fff", padding: "10%", height: "100vh" }}>
          <img
            src={logoMaewMeeCake}
            alt="Logo"
            style={{
              width: "100%",
              maxWidth: "140px",
              display: "block",
              margin: "0 auto 20px",
            }}
          />
          <MenuContent/>
        </div>
      )}
    </>
  );
}

export default SideBarMenu;