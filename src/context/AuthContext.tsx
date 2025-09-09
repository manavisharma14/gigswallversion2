'use client';
import * as React from 'react';

type UserType = 'student' | 'other';
export interface AuthUser {
  id: string; name: string; email?: string;
  type: UserType; phone?: string|null; department?: string|null;
  gradYear?: string|null; college?: string|null; createdAt?: string;
}

type AuthCtx = {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = React.createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: { children: React.ReactNode; initialUser?: AuthUser | null }) {
  const [user, setUser] = React.useState<AuthUser | null>(initialUser ?? null);
  const [loading, setLoading] = React.useState(true);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
      else if (initialUser) {
        localStorage.setItem('user', JSON.stringify(initialUser));
        setUser(initialUser);
      }
    } catch { setUser(null); }
    const sync = () => {
      const v = localStorage.getItem('user');
      if (v) { try { setUser(JSON.parse(v)); } catch { setUser(null); } }
      else setUser(null);
    };
    window.addEventListener('storageChanged', sync);
    setHydrated(true);
    setLoading(false);
    return () => window.removeEventListener('storageChanged', sync);
  }, [initialUser]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('storageChanged'));
  };

  if (!hydrated) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}