import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import Dashboard from "./pages/DashboardPage";
import "react-datepicker/dist/react-datepicker.css";





function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* หน้าแรก → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

        {/* Protected Page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* กัน path แปลก ๆ */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
