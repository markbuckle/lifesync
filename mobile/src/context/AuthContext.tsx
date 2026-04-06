import React, { createContext, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

// ─── Types ───────────────────────────────────────────────
interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

// ─── Provider ────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading] = useState(false);

  const login = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync('token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setToken(null);
    } catch (error) {
      console.error('Failed to delete token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────
export function useAuth() {
  return useContext(AuthContext);
}