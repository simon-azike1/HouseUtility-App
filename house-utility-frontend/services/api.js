// /services/api.js
import axios from "axios";

// Base API instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
  withCredentials: true,
});

// ✅ Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/me", data),
  getAllUsers: () => api.get("/auth/users"),
  
  // ✅ Email Verification - UPDATED TO ACCEPT INVITE CODE
  verifyEmail: (token, inviteCode) => api.post("/auth/verify-email", { token, inviteCode }),
  resendVerification: (email) => api.post("/auth/resend-verification", { email }),
};

// ✅ Household API
export const householdAPI = {
  getHousehold: () => api.get("/household"),
  getMembers: () => api.get("/household/members"),
  joinHousehold: (inviteCode) => api.post("/household/join", { inviteCode }),
  updateMemberRole: (userId, role) => api.put(`/household/members/${userId}/role`, { role }),
  removeMember: (userId) => api.delete(`/household/members/${userId}`),
};

// ✅ Export base API as default
export default api;
