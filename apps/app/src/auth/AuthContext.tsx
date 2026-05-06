import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { authApi } from '../services/authApi';
import { tokenStore } from '../services/tokenStore';
import { User } from '../types/auth';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await tokenStore.get();

        if (token) {
          setUser(await authApi.me());
        }
      } catch {
        await tokenStore.remove();
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (email, password) => {
        const response = await authApi.login({ email: email.trim(), password });
        await tokenStore.set(response.token);
        setUser(response.user);
      },
      register: async (displayName, email, password) => {
        const response = await authApi.register({
          displayName: displayName.trim(),
          email: email.trim(),
          password,
        });
        await tokenStore.set(response.token);
        setUser(response.user);
      },
      logout: async () => {
        await tokenStore.remove();
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
