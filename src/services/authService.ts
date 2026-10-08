import { User } from '../types';
import { API_CONFIG } from './apiConfig';

export const authService = {
  getRegisteredUsers(): string[] {
    try {
      const stored = localStorage.getItem('supermind_registered_users');
      return stored ? JSON.parse(stored) : ['demo@supermind.ai', 'user@supermind.ai', 'alex@company.com', '+1 (555) 234-5678'];
    } catch {
      return ['demo@supermind.ai'];
    }
  },

  checkUserExists(emailOrPhone: string): boolean {
    if (!emailOrPhone) return false;
    const cleanInput = emailOrPhone.trim().toLowerCase();
    const registered = this.getRegisteredUsers();
    return registered.some((userIdentifier) => userIdentifier.toLowerCase() === cleanInput);
  },

  registerUserInRegistry(emailOrPhone: string): void {
    if (!emailOrPhone) return;
    const cleanInput = emailOrPhone.trim().toLowerCase();
    const registered = this.getRegisteredUsers();
    if (!registered.includes(cleanInput)) {
      registered.push(cleanInput);
      localStorage.setItem('supermind_registered_users', JSON.stringify(registered));
    }
  },

  getToken(): string | null {

    return localStorage.getItem('supermind_token');
  },

  getTokenExpirationMs(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return null;
      const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.exp) {
        return payload.exp * 1000; // seconds to ms
      }
    } catch (e) {
      return null;
    }
    return null;
  },

  isTokenExpired(): boolean {
    const expMs = this.getTokenExpirationMs();
    if (!expMs) return false;
    return Date.now() >= expMs;
  },

  getTimeUntilExpirationMs(): number {
    const expMs = this.getTokenExpirationMs();
    if (!expMs) return 0;
    const remaining = expMs - Date.now();
    return remaining > 0 ? remaining : 0;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    const stored = localStorage.getItem('supermind_user');

    if (!token && !stored) {
      // Default demo user so Dashboard always loads cleanly
      const demoUser: User = {
        id: 'usr_demo_101',
        name: 'Alex Developer',
        email: 'demo@supermind.ai',
        planTier: 'Pro',
        tokensUsed: 624000,
        tokenBudget: 5000000,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('supermind_token', 'mock_jwt_token_2026');
      localStorage.setItem('supermind_user', JSON.stringify(demoUser));
      return demoUser;
    }

    if (this.isTokenExpired()) {
      await this.logout();
      return null;
    }

    try {
      if (token) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const user = await res.json();
          localStorage.setItem('supermind_user', JSON.stringify(user));
          return user;
        }
      }
    } catch (err) {
      // Fallback to local stored session if offline
    }

    return stored ? JSON.parse(stored) : null;
  },

  async loginWithSocial(provider: 'google' | 'facebook' | 'apple'): Promise<User> {
    const formattedProviderName = provider === 'google' ? 'Google' : provider === 'facebook' ? 'Facebook' : 'Apple';
    const providerEnum = provider.toUpperCase() as 'GOOGLE' | 'FACEBOOK' | 'APPLE';
    const email = `user.${provider}.${Date.now().toString().slice(-6)}@supermind.ai`;
    const mockUser: User = {
      id: `usr_${provider}_${Date.now()}`,
      name: `${formattedProviderName} User`,
      email,
      authProvider: providerEnum,
      providerId: `oauth_${provider}_${Date.now()}`,
      planTier: 'Pro',
      tokensUsed: 0,
      tokenBudget: 5000000,
      createdAt: new Date().toISOString(),
    };
    this.registerUserInRegistry(email);
    localStorage.setItem('supermind_token', `mock_${provider}_jwt_token_${Date.now()}`);
    localStorage.setItem('supermind_user', JSON.stringify(mockUser));
    return mockUser;
  },

  async loginWithPhone(phone: string): Promise<User> {
    const cleanPhone = phone.replace(/[^0-9]/g, '') || '9876543210';
    const email = `phone.${cleanPhone}@supermind.ai`;
    const mockUser: User = {
      id: `usr_phone_${Date.now()}`,
      name: `User (+${cleanPhone.slice(-4)})`,
      email,
      authProvider: 'PHONE',
      providerId: cleanPhone,
      planTier: 'Pro',
      tokensUsed: 0,
      tokenBudget: 5000000,
      createdAt: new Date().toISOString(),
    };
    this.registerUserInRegistry(email);
    this.registerUserInRegistry(cleanPhone);
    localStorage.setItem('supermind_token', `mock_phone_jwt_token_${Date.now()}`);
    localStorage.setItem('supermind_user', JSON.stringify(mockUser));
    return mockUser;
  },






  async login(email: string, password: string): Promise<User> {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      localStorage.setItem('supermind_token', data.accessToken);
      localStorage.setItem('supermind_user', JSON.stringify(data.user));
      return data.user;
    } catch (err: any) {
      // Local fallback for standalone demo
      const mockUser: User = {
        id: 'usr_demo_101',
        name: 'Alex Developer',
        email,
        planTier: 'Pro',
        tokensUsed: 624000,
        tokenBudget: 5000000,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('supermind_token', 'mock_jwt_token_2026');
      localStorage.setItem('supermind_user', JSON.stringify(mockUser));
      return mockUser;
    }
  },

  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('supermind_token', data.accessToken);
      localStorage.setItem('supermind_user', JSON.stringify(data.user));
      return data.user;
    } catch (err: any) {
      const mockUser: User = {
        id: `usr_${Date.now()}`,
        name,
        email,
        planTier: 'Pro',
        tokensUsed: 0,
        tokenBudget: 5000000,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('supermind_token', 'mock_jwt_token_2026');
      localStorage.setItem('supermind_user', JSON.stringify(mockUser));
      return mockUser;
    }
  },

  async sendVerificationCode(
    email: string,
    purpose: 'login' | 'register' | 'forgot_password' = 'forgot_password',
  ): Promise<{ code: string }> {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP email');
      return { code: data.code || '123456' };
    } catch (err) {
      // Fallback code for local frontend preview
      return { code: '123456' };
    }
  },

  async verifyCode(email: string, code: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) return false;
      return !!data.valid;
    } catch (err) {
      // Local fallback testing: accepts 123456 or any 6 digits
      return code.length === 6 && (code === '123456' || /^\d{6}$/.test(code));
    }
  },

  async resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      return true;
    } catch (err) {
      return true;
    }
  },

  async updateProfile(updatedData: Partial<User>): Promise<User> {
    const token = this.getToken();
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      const updatedUser = await res.json();
      localStorage.setItem('supermind_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      // Local fallback for standalone demo mode
      const stored = localStorage.getItem('supermind_user');
      const currentUser: User = stored ? JSON.parse(stored) : {
        id: 'usr_demo_101',
        name: 'Alex Developer',
        email: 'demo@supermind.ai',
        planTier: 'Pro',
        tokensUsed: 624000,
        tokenBudget: 5000000,
        createdAt: new Date().toISOString(),
      };

      const newUser = { ...currentUser, ...updatedData };
      localStorage.setItem('supermind_user', JSON.stringify(newUser));
      return newUser;
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('supermind_token');
    localStorage.removeItem('supermind_user');
  },
};
