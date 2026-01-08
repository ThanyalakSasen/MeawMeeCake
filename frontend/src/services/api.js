
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor เพื่อใส่ token ทุกครั้ง
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor สำหรับ error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url;

    // ❌ ห้าม redirect ถ้าเป็น google oauth
    if (
      error.response?.status === 401 &&
      !url?.includes('/auth/google')
    ) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;