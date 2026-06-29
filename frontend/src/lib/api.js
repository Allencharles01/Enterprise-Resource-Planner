import axios from "axios";

export const apiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

export const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});
