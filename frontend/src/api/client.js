import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("loanx_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "An unexpected error occurred.";

    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.errors = error.response?.data?.errors;

    return Promise.reject(customError);
  }
);

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  demoLogin: () => api.post("/auth/demo-login"),
  register: (userData) => api.post("/auth/register", userData),
  registerAdmin: (adminData) => api.post("/auth/register-admin", adminData),
  getMe: () => api.get("/auth/me"),
  updateMe: (data) => api.put("/auth/me", data),
};

export const predictionApi = {
  create: (features) => api.post("/predictions", features),
  getAll: (params) => api.get("/predictions", { params }),
  getById: (id) => api.get(`/predictions/${id}`),
  getExplanation: (id) => api.get(`/predictions/${id}/explanation`),
};

// AI Loan Advisor API
export const aiAdvisorApi = {
  ask: (predictionId, question, conversationHistory = []) =>
    api.post("/ai-advisor", {
      predictionId,
      question,
      conversationHistory,
    }),
};

// AI Loan Improvement Suggestions API
export const improvementApi = {
  getSuggestions: (predictionId) =>
    api.post("/ai-advisor/improvement-suggestions", {
      predictionId,
    }),
};

export const adminApi = {
  getStats: () => api.get("/admin/stats"),
  getPredictions: (params) => api.get("/admin/predictions", { params }),
  getUsers: (params) => api.get("/admin/users", { params }),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
};
