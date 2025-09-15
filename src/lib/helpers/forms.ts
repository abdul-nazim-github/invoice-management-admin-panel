export function cleanValues<T extends Record<string, any>>(values: T): Partial<T> {
  const entries: [keyof T, T[keyof T]][] = Object.entries(values) as [keyof T, T[keyof T]][];
  
  const cleaned = entries
    .filter(([_, v]) => {
      if (typeof v === "string") return v.trim() !== "";
      if (Array.isArray(v)) return v.some((item: string) => item.trim() !== "");
      return v !== null && v !== undefined;
    })
    .map(([key, v]) => {
      if (typeof v === "string") return [key, v.trim()] as [keyof T, T[keyof T]];
      if (Array.isArray(v))
        return [key, v.map((item: string) => item.trim()).filter((item: string) => item !== "")] as [keyof T, T[keyof T]];
      return [key, v] as [keyof T, T[keyof T]];
    });

  return Object.fromEntries(cleaned) as Partial<T>;
}