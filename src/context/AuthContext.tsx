"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
} | null;

interface AuthContextProps {
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // fetch user from backend
  async function refreshUser() {
    try {
      const resp = await fetch("/api/users/me", {
        credentials: "include", // send cookies
      });      
      if (!resp.ok) throw new Error("Unauthorized");
      const data = await resp.json();            
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  // logout function
  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // send cookies
      });
    } catch {
      // ignore errors
    } finally {
      setUser(null);
      router.replace("/"); // redirect to login
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
