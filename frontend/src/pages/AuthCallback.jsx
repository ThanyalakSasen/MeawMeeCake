import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    const profileCompleted = params.get("profileCompleted");

    console.log("🔐 AUTH CALLBACK");
    console.log("Token:", token);
    console.log("profileCompleted:", profileCompleted);

    if (!token) {
      console.log("❌ NO TOKEN");
      navigate("/login");
      return;
    }

    // เก็บ token
    localStorage.setItem("token", token);

    const init = async () => {
      const user = await checkAuth();

      console.log("👤 USER FROM CHECKAUTH:", user);

      if (!user) {
        navigate("/login");
        return;
      }

      if (profileCompleted === "false") {
        console.log("➡️ GO TO /update");
        navigate("/update");
      } else {
        console.log("➡️ GO TO /dashboard");
        navigate("/dashboard");
      }
    };

    init();
  }, []);

  return <p>กำลังเข้าสู่ระบบ...</p>;
}
