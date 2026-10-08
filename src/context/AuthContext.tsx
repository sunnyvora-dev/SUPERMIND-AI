import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenTimeRemainingSec: number;
  login: (email: string, pass: string) => Promise<User>;
  loginWithSocial: (provider: 'google' | 'facebook' | 'apple') => Promise<User>;
  loginWithPhone: (phone: string) => Promise<User>;
  register: (name: string, email: string, pass: string) => Promise<User>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tokenTimeRemainingSec, setTokenTimeRemainingSec] = useState<number>(0);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((u) => {
        setUser(u);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Monitor JWT Token Expiration and trigger Automatic Unlogin
  useEffect(() => {
    if (!user) {
      setTokenTimeRemainingSec(0);
      return;
    }

    const checkExpiration = async () => {
      if (authService.isTokenExpired()) {
        console.warn('JWT token expired. Triggering automatic logout...');
        await logout();
        return;
      }

      const remainingMs = authService.getTimeUntilExpirationMs();
      setTokenTimeRemainingSec(Math.ceil(remainingMs / 1000));
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, pass: string) => {
    const u = await authService.login(email, pass);
    setUser(u);
    return u;
  };

  const loginWithSocial = async (provider: 'google' | 'facebook' | 'apple') => {
    const u = await authService.loginWithSocial(provider);
    setUser(u);
    return u;
  };

  const loginWithPhone = async (phone: string) => {
    const u = await authService.loginWithPhone(phone);
    setUser(u);
    return u;
  };

  const register = async (name: string, email: string, pass: string) => {
    const u = await authService.register(name, email, pass);
    setUser(u);
    return u;
  };

  const updateProfile = async (data: Partial<User>) => {
    const u = await authService.updateProfile(data);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setTokenTimeRemainingSec(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        tokenTimeRemainingSec,
        login,
        loginWithSocial,
        loginWithPhone,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

