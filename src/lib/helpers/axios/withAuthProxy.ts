// lib/withAuthProxy.ts
import { getAcessToken } from "../cookieHandler";
import API from "./API";
import { jwtDecode } from "jwt-decode";

interface ProxyOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

let cachedToken: string | null = null;

const isTokenExpired = (token: string) => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // If there's an error decoding, assume it's expired
  }
};

export async function withAuthProxy<T = any>(options: ProxyOptions): Promise<T> {
  if (!cachedToken || isTokenExpired(cachedToken)) {
    cachedToken = await getAcessToken();
  }

  try {
    const response = await API.request<T>({
      url: options.url,
      method: options.method || "GET",
      data: options.data,
      params: options.params,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: cachedToken ? `Bearer ${cachedToken}` : "",
      },
    });

    return response.data;
  } catch (err: any) {
    if (err.response && err.response.status === 401) {
      // Token might be invalid on the server side, clear cache and retry once.
      cachedToken = await getAcessToken(); // This should fetch a new token
      if (!cachedToken) {
        throw {
            status: 401,
            data: { success: false, error: "Authentication failed" },
        };
      }
      const response = await API.request<T>({
        url: options.url,
        method: options.method || "GET",
        data: options.data,
        params: options.params,
        headers: {
          ...(options.headers || {}),
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cachedToken}`,
        },
      });
      return response.data;
    }
    throw {
      status: err?.response?.status || 500,
      data: err?.response?.data || { success: false, error: "Internal Server Error" },
    };
  }
}
