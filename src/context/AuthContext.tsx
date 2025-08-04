"use client";
import { createContext, useContext, useState, useEffect } from "react";

type UserType = "student" | "other";

interface AuthUser {
  id: string;
  name: string;
  email?: string;
  type: UserType;
  phone?: string | null;
  department?: string | null;
  gradYear?: string | null;
  college?: string | null;
  createdAt?: string;
}

const AuthContext = createContext<{
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
}) => {
  const [user, setUser] = useState<AuthUser | null>(initialUser ?? null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (err) {
        console.error("Invalid user in localStorage", err);
      }
    } else if (initialUser) {
      // If no localStorage, store the server-side user for future sync
      localStorage.setItem("user", JSON.stringify(initialUser));
    }

    const syncUser = () => {
      const newUser = localStorage.getItem("user");
      if (newUser) setUser(JSON.parse(newUser));
    };

    window.addEventListener("storageChanged", syncUser);
    setIsHydrated(true);

    return () => {
      window.removeEventListener("storageChanged", syncUser);
    };
  }, [initialUser]);

  if (!isHydrated) return null;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);