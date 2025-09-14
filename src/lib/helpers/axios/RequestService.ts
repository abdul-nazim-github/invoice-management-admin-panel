import { CustomRequestType } from "@/lib/types/api";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

async function handleResponse<T>(res: Response): Promise<T> {
  let data: any = { success: false, message: "Unexpected response format" };
  try {
    if (res.headers.get("content-type")?.includes("application/json")) {
      data = await res.json();
    }
  } catch {
    data = { success: false, message: "Invalid JSON response" };
  }

  if (!res.ok || data?.success === false) {
    throw {
      status: res.status,
      type: data?.type || (res.status >= 500 ? "server_error" : "unknown_error"),
      message: data?.message || "Server Error",
      error: data?.error ?? { details: "Something went wrong, Please try again later." },
    };
  }
  return data as T;
}


async function safeFetch(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // ⏱ 15s timeout

  try {
    return await fetch(url, {
      ...options,
      credentials: "include", // ✅ include cookies for auth
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function getRequest<T = any>(url: string): Promise<T> {
  const res = await safeFetch(url, { method: "GET" });
  return handleResponse<T>(res);
}

export async function postRequest<T = any>({ url, body }: CustomRequestType): Promise<T> {
  const res = await safeFetch(url, {
    method: "POST",
    headers: { ...DEFAULT_HEADERS },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function putRequest<T = any>(url: string, body: any): Promise<T> {
  const res = await safeFetch(url, {
    method: "PUT",
    headers: { ...DEFAULT_HEADERS },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function deleteRequest<T = any>(url: string): Promise<T> {
  const res = await safeFetch(url, { method: "DELETE" });
  return handleResponse<T>(res);
}
