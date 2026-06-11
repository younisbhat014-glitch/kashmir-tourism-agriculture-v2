import * as SecureStore from 'expo-secure-store';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { authApi, AuthResult, TOKEN_KEY, User, USER_KEY } from '@/services/api-client';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function saveSession(result: AuthResult) {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, result.token),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(result.user)),
  ]);
}

async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(USER_KEY)
      .then((saved) => saved && setUser(JSON.parse(saved)))
      .catch(clearSession)
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authApi.login(email.trim().toLowerCase(), password);
    await saveSession(result);
    setUser(result.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await authApi.register(name.trim(), email.trim().toLowerCase(), password);
    await saveSession(result);
    setUser(result.user);
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
