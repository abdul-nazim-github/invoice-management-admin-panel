export function getCookie(name: string): string | null {
  try {
    if (typeof document === "undefined") return null;
    const match = document.cookie?.split("; ")?.find((row) => row.startsWith(name + "="));
    if (!match) return null;
    let value = decodeURIComponent(match?.split("=")[1]);
    value = value?.replace(/^"(.+)"$/, "$1");
    return value;
  } catch (error) {
    console.error(`Failed to get cookie "${name}":`, error);
    return null;
  }
}
