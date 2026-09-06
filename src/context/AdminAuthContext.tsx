import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types';
import { adminLogin, adminVerifySession, adminLogout } from '../lib/api';

interface AdminAuthContextType {
  user: AdminUser | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const currentUser = await adminVerifySession();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        console.warn('Admin session check completed:', err);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const res = await adminLogin({ username, password });
      if (res.token) {
        localStorage.setItem('altaj_admin_token', res.token);
      }
      setUser(res.user);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your username and password.');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await adminLogout();
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AdminAuthContext.Provider value={{ user, admin: user, isAuthenticated: !!user, loading, error, login, logout, clearError }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
