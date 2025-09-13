export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null; // check client-side

  const cookies = document.cookie.split("; "); // split all cookies
  const cookie = cookies.find((c) => c.startsWith(name + "="));
  if (!cookie) return null;

  return cookie.split("=")[1];
}