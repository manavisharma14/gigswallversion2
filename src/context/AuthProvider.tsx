'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'other';
};

interface AuthValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthValue>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]     = useState<User | null>(null);
  const [loading, setLoad]  = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch('/api/dashboard/profile', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: 'include',
        });

        if (res.ok) setUser(await res.json());
      } catch (err) {
        console.error('Auth fetch failed:', err);
      } finally {
        setLoad(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}