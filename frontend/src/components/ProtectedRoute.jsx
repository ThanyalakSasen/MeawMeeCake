import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowIncomplete = false }) {
  const { user, loading } = useAuth();

  console.log("🛡️ USER:", user);
  console.log("🛡️ LOADING:", loading);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.profileCompleted && !allowIncomplete) {
    return <Navigate to="/update" replace />;
  }

  return children;
}
