import { CustomRequestType } from "@/lib/types/api";

// lib/httpClient.ts
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export async function getRequest<T = any>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET" });
  return handleResponse<T>(res);
}

export async function postRequest<T = any>({ url, body }: CustomRequestType): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function putRequest<T = any>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function deleteRequest<T = any>(url: string): Promise<T> {
  const res = await fetch(url, { method: "DELETE" });
  return handleResponse<T>(res);
}
