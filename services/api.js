// /services/api.js
import axios from "axios";

// Base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/me", data),
  getAllUsers: () => api.get("/auth/users"), // fallback for members list
};

// ✅ Household API
export const householdAPI = {
  getHousehold: () => api.get("/household"),
  getMembers: () => api.get("/household/members"),
  joinHousehold: (code) => api.post("/household/join", { code }),
  createHousehold: (data) => api.post("/household", data),
};

// ✅ Export base API as default
export default api;
