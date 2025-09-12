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
    const access_token = Cookies.get("access_token");
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
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
        Cookies.remove("access_token"); // clear cookie
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
