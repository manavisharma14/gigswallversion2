"use client";
import { createContext, useContext, useState, useEffect } from "react";

type UserType = "student" | "other";

interface AuthUser {
  id: string;
  name: string;
  email?: string;
  type: UserType;
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
  initialUser: AuthUser | null;
}) => {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isHydrated, setIsHydrated] = useState(false);

useEffect(() => {
  setIsHydrated(true);
}, []);

if (!isHydrated) return null;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);