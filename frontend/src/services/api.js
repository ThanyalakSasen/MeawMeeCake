import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Register
  register: async (userData) => {
    const response = await api.post("/auth/register", {
      user_fullname: userData.user_fullname,
      email: userData.email,
      password: userData.password,
      user_phone: userData.user_phone,
      user_birthdate: userData.user_birthdate,
      user_allergies: userData.user_allergies || [],
      role: "Customer",
      authProvider: userData.googleId ? "google" : "local",
      ...(userData.googleId && { googleId: userData.googleId }),
    });
    return response;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    if (response.data.success && response.data.user && response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  },

  // Google Login
  googleLogin: async (credential) => {
    const response = await api.post("/auth/google", { credential });

    // Check if email verification is needed
    if (response.data.needVerify) {
      return response;
    }

    // If login successful, save user data
    if (response.data.success && response.data.user) {
      localStorage.setItem("token", "google_authenticated");
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response;
  },

  // Resend verification email
  resendVerification: async (email) => {
    const response = await api.post("/auth/resend-verification", { email });
    return response;
  },

  // Check authentication status
  checkAuth: async () => {
    const response = await api.get("/auth/check");
    return response;
  },
};

export default api;