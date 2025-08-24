import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001"; // fallback for local dev

const api = axios.create({
  baseURL,
  withCredentials: false, // optional
});

// attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
