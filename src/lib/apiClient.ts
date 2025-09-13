// lib/apiClient.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { cookies } from "next/headers";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ✅ Request Interceptor (server-side only)
apiClient.interceptors.request.use(
  async (config) => {
    const cookieStore = cookies(); // Next.js server-side cookies
    const token = (await cookieStore).get("access_token")?.value;

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
      console.warn("Unauthorized (401) - access token missing/expired");
    } else if (status === 403) {
      console.error("Forbidden (403): You don’t have access.");
    } else if (status === 404) {
      console.error("Not Found (404): The resource doesn’t exist.");
    } else if (status && status >= 500) {
      console.error("Server Error (5xx). Please try again later.");
    }

    return Promise.reject({ status, message, raw: error.response?.data });
  }
);

export default apiClient;
