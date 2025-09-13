// lib/fetcher.ts
import { getCookie } from "@/app/esrf";

export async function fetcher<T = any>(
  url: string,
  options: RequestInit = {},
  toast?: (args: { title: string; description: string; variant: "success" | "destructive" }) => void
): Promise<T> {
  try {
    const token = getCookie("access_token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const res = await fetch(url, { ...options, headers });
    const data = await res.json();

    if (!res.ok || data.success === false) {
      toast?.({
        title: "Error",
        description: data.error || "Request failed",
        variant: "destructive",
      });
      throw new Error(data.error || "Request failed");
    }

    return data;
  } catch (error: any) {
    toast?.({
      title: "Error",
      description: error.message || "Something went wrong",
      variant: "destructive",
    });
    throw error;
  }
}
