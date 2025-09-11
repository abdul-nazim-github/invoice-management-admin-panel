// apiClient.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import Cookies from "js-cookie";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout
});

// ✅ Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Read token from cookies (client side only)
    // const token = Cookies.get("token");
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTk5MzhhOS1jMmZlLTdjOGUtYTljNC05Mzk0OWZmNGUwZmYiLCJlbWFpbCI6ImFkbWluMUBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNzU3Njc4NjgwLCJpYXQiOjE3NTc1OTIyODB9.x05NpcWEeh7SfR1Oqlv06HE738_4aKOTui3lKH3ENVA'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      "Unknown error occurred";

    if (status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      if (typeof window !== "undefined") {
        Cookies.remove("token"); // clear cookie
        window.location.href = "/login";
      }
    } else if (status === 403) {
      console.error("Forbidden: You don’t have access.");
    } else if (status === 404) {
      console.error("Not Found: The resource doesn’t exist.");
    } else if (status && status >= 500) {
      console.error("Server Error. Please try again later.");
    }

    return Promise.reject({
      status,
      message,
      raw: error.response?.data,
    });
  }
);

export default apiClient;
