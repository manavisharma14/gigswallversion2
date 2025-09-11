'use client';
import * as React from 'react';

type UserType = 'student' | 'other';
export interface AuthUser {
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

type AuthCtx = {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  logout: () => void;
  loading: boolean;
  revalidate: () => Promise<void>;
};

const AuthContext = React.createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
}) {
  const [user, setUser] = React.useState<AuthUser | null>(initialUser ?? null);
  const [loading, setLoading] = React.useState(true);
  const [hydrated, setHydrated] = React.useState(false);

  const softLogout = React.useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('storageChanged')); // notify other tabs
  }, []);

  const revalidate = React.useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      softLogout();
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const serverUser = (await res.json()) as AuthUser;
        setUser(serverUser);
        localStorage.setItem('user', JSON.stringify(serverUser));
      } else if (res.status === 401) {
        softLogout();
      } else {
        console.error('Auth revalidate failed:', res.status);
      }
    } catch (e) {
      console.error('Auth revalidate error:', e);
    } finally {
      setLoading(false);
    }
  }, [softLogout]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      softLogout();
    } else {
      try {
        const raw = localStorage.getItem('user');
        if (raw) setUser(JSON.parse(raw));
        else if (initialUser) {
          localStorage.setItem('user', JSON.stringify(initialUser));
          setUser(initialUser);
        }
      } catch {
        setUser(null);
      }
    }

    // Validate on mount + when tab visible again
    revalidate();
    const onVis = () => {
      if (document.visibilityState === 'visible') revalidate();
    };
    document.addEventListener('visibilitychange', onVis);

    // Cross-tab updates
    const sync = () => {
      const token = localStorage.getItem('token');
      const v = localStorage.getItem('user');
      if (!token || !v) {
        setUser(null);
      } else {
        try {
          setUser(JSON.parse(v));
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener('storageChanged', sync);

    setHydrated(true);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('storageChanged', sync);
    };
  }, [initialUser, revalidate, softLogout]);

  const logout = React.useCallback(() => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    softLogout();
  }, [softLogout]);

  if (!hydrated) return null;

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, loading, revalidate }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}