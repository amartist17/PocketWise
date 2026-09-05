import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getErrorMessage } from '@/services/api';
import { authService } from '@/services/auth.service';
import { tokenStorage } from '@/services/token-storage';
import { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isBootstrapping: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tokenStorage.get().then(async (token) => {
      if (!token) return;
      try { setUser(await authService.me()); } catch { await tokenStorage.remove(); }
    }).finally(() => setIsBootstrapping(false));
  }, []);

  async function authenticate(action: () => Promise<{ token: string; user: User }>) {
    setError(null);
    try {
      const result = await action();
      await tokenStorage.set(result.token);
      setUser(result.user);
    } catch (caught) {
      const message = getErrorMessage(caught);
      setError(message);
      throw new Error(message);
    }
  }

  const value = useMemo<AuthContextValue>(() => ({
    user, isBootstrapping, error,
    login: (email, password) => authenticate(() => authService.login({ email, password })),
    register: (name, email, password) => authenticate(() => authService.register({ name, email, password })),
    logout: async () => { await tokenStorage.remove(); setUser(null); },
    deleteAccount: async () => { await authService.deleteAccount(); await tokenStorage.remove(); setUser(null); },
  }), [user, isBootstrapping, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
