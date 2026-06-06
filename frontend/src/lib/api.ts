import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
});

// Attach auth token from localStorage on every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("vitacore_user");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch {}
  }
  return config;
});

export default api;
