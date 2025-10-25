 import axios from "axios";

// استخدم المتغير من Vite
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:5000/api/v1
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
