import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import Dashboard from "./pages/DashboardPage";
import ProtectedRoute from './components/ProtectedRoute';
import "react-datepicker/dist/react-datepicker.css";
import AuthCallback from './pages/AuthCallback';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CompleteProfile from './pages/CompleteProfile';
import UpdateProfile from './pages/UpdatePage'

function App() {
  return (
    <Routes>
      {/* หน้าแรก → Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth Pages (Public) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      
      {/* Google OAuth Callback */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Complete Profile (Protected - ต้องมี token) */}
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />
      <Route path="/update" element={
        <ProtectedRoute allowIncomplete>
            <UpdateProfile />
        </ProtectedRoute>
} />

      {/* Dashboard (Protected - ต้อง profileCompleted: true) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* กัน path แปลก ๆ */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;