import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = '@bram_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setIsAuthenticated(true);
        setUserEmail(data.email);
      }
    } catch (e) {
      console.error('Failed to check auth', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email.trim() || !password.trim()) return false;
    const authData = { email: email.trim(), loggedInAt: Date.now() };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    setUserEmail(email.trim());
    setIsAuthenticated(true);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, userEmail, login, logout }),
    [isAuthenticated, isLoading, userEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
