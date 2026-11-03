import axios from "axios";

// Central Axios instance using the configured environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor: Attach JWT/Auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("upsc_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem("upsc_token");
      localStorage.removeItem("upsc_user");
    }
    return Promise.reject(error);
  }
);

export default api;

