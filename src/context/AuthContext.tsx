import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, getToken } from '../api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (params: { name: string; email: string; password: string; bio?: string; targetRole?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (params: { name: string; bio?: string; targetRole?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await api.getMe();
        setUser(user);
      } catch (err) {
        console.warn('Stored token invalid, clearing:', err);
        api.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setUser(res.user);
  };

  const demoLogin = async () => {
    await login('alex@lonexora.edu', 'Demo1234!');
  };

  const register = async (params: { name: string; email: string; password: string; bio?: string; targetRole?: string }) => {
    const res = await api.register(params);
    setUser(res.user);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const updateProfile = async (params: { name: string; bio?: string; targetRole?: string }) => {
    const res = await api.updateProfile(params);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, demoLogin, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
