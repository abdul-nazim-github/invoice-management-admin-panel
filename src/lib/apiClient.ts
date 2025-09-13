import { getAccessToken } from "@/app/actionCookie";
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

export default apiClient;