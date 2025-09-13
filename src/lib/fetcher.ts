export async function fetcher<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
}
