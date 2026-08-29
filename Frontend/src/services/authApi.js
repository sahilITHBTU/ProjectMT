import api from "./api";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),

  login: (credentials) => api.post("/auth/login", credentials),

  logout: () => api.post("/auth/logout"),

  getCurrentUser: () => api.post("/auth/current-user"),

  resendVerification: () => api.post("/auth/resend-email-verification"),

  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),

  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),

  resetPassword: (token, payload) =>
    api.post(`/auth/reset-password/${token}`, payload),

  changePassword: (payload) => api.post("/auth/change-password", payload),

  updateAvatar: (formData) =>
    api.patch("/auth/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
