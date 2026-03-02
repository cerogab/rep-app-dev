import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  userName: string | null;
  userPhoto: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  googleLogin: (email: string, name: string, photo: string | null) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = '@bram_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setIsAuthenticated(true);
        setUserEmail(data.email);
        setUserName(data.name || null);
        setUserPhoto(data.photo || null);
      }
    } catch (e) {
      console.error('Failed to load auth', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email.trim().length > 0 && password.trim().length > 0) {
      const authData = { email: email.trim(), loggedInAt: Date.now() };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      setUserEmail(email.trim());
      setUserName(null);
      setUserPhoto(null);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const googleLogin = async (email: string, name: string, photo: string | null): Promise<boolean> => {
    const authData = { email, name, photo, provider: 'google', loggedInAt: Date.now() };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    setUserEmail(email);
    setUserName(name);
    setUserPhoto(photo);
    setIsAuthenticated(true);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserName(null);
    setUserPhoto(null);
  };

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, userEmail, userName, userPhoto, login, googleLogin, logout }),
    [isAuthenticated, isLoading, userEmail, userName, userPhoto],
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
