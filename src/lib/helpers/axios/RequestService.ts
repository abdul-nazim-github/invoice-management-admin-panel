import { CustomRequestType } from "@/lib/types/api";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
async function handleResponse<T>(res: Response): Promise<T> {
  let data: any = { success: false, message: "Unexpected response format" };
  try {
    if (res.headers.get("content-type")?.includes("application/json")) {
      data = await res.json();
    }
  } catch {
    data = {
      success: false,
      type: "unknown_error",
      message: "Invalid JSON response",
      error: { details: "The server returned an invalid response." },
    };
  }

  if (!res.ok || data?.success === false) {
    const status = res.status;
    if (status >= 500) {
      throw {
        status,
        type: "server_error",
        message: "Server Error",
        error: { details: "Something went wrong, please try again later." },
      };
    }
    throw {
      status,
      type: data?.type || "unknown_error",
      message: data?.message || "Request failed",
      error: data?.error || { details: "Unknown error occurred" },
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
      credentials: "include",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function getRequest<T = any>({ url }: { url: string }): Promise<T> {  
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
