import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001"; // fallback for local dev

const api = axios.create({
  baseURL,
  withCredentials: true, // optional
});

export default api;
