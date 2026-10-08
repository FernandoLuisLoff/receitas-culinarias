import { createContext, useEffect, useState, type ReactNode } from 'react';
import { TOKEN_STORAGE_KEY } from '../services/api';
import { login as loginRequest, type LoginPayload } from '../services/authService';

export interface AuthUserInfo {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface AuthContextValue {
  user: AuthUserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => void;
}

const USER_STORAGE_KEY = 'receitas:user';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserInfo | null>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUserInfo) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mantém o usuário sincronizado caso o token seja removido em outra aba.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === TOKEN_STORAGE_KEY && event.newValue === null) {
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  async function signIn(payload: LoginPayload) {
    setIsLoading(true);
    setError(null);
    try {
      const authUser = await loginRequest(payload);
      const userInfo: AuthUserInfo = {
        id: authUser.id,
        username: authUser.username,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        image: authUser.image,
      };
      localStorage.setItem(TOKEN_STORAGE_KEY, authUser.accessToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo));
      setUser(userInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao autenticar.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
