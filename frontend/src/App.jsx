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
import UpdatePage from './pages/UpdatePage';

function App() {
  return (
    <Routes>

      {/* หน้าแรก → Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/update' element={<UpdatePage/>} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      {/* Protected Page */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      {/* กัน path แปลก ๆ */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default App;
