// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from "../services/authService";


const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ตรวจสอบ authentication เมื่อ app load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };
  
  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setUser(data.user);
    return data;
  };
  
  const register = async (userData) => {
    return await authAPI.register(userData);
  };
  
  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };
  
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};