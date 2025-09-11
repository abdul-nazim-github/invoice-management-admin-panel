// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include", // sends cookies
        });

        if (!res.ok) throw new Error("Not authenticated");

        setAuthenticated(true);
      } catch {
        router.push("/"); // redirect to login
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  return { authenticated, loading };
}
