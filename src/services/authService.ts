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

  normalizeUser(user: any): User {
    const rawTier = (user.tier || user.planTier || '').toUpperCase();
    let planTier: 'Free Trial' | 'Starter' | 'Pro' | 'Enterprise' = 'Free Trial';
    let tokenBudget = 100000; // 100,000 free trial tokens

    if (rawTier === 'STARTER') {
      planTier = 'Starter';
      tokenBudget = 500000;
    } else if (rawTier === 'PRO') {
      planTier = 'Pro';
      tokenBudget = 5000000;
    } else if (rawTier === 'ENTERPRISE') {
      planTier = 'Enterprise';
      tokenBudget = 50000000;
    } else if (user.planTier) {
      planTier = user.planTier;
      tokenBudget = user.tokenBudget || (planTier === 'Enterprise' ? 50000000 : planTier === 'Pro' ? 5000000 : planTier === 'Starter' ? 500000 : 100000);
    }

    return {
      id: user.id || `usr_${Date.now()}`,
      name: user.name || 'User',
      email: user.email,
      role: (user.role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN',
      planTier,
      tokensUsed: typeof user.tokensUsed === 'number' ? user.tokensUsed : 0,
      tokenBudget,
      createdAt: user.createdAt || new Date().toISOString(),
      avatarUrl: user.avatarUrl,
      authProvider: user.authProvider,
      providerId: user.providerId,
    };
  },

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    const stored = localStorage.getItem('supermind_user');

    if (!token || token === 'mock_jwt_token_2026') {
      localStorage.removeItem('supermind_token');
      localStorage.removeItem('supermind_user');
      return null;
    }

    if (this.isTokenExpired()) {
      await this.logout();
      return null;
    }

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const rawUser = await res.json();
        const user = this.normalizeUser(rawUser);
        localStorage.setItem('supermind_user', JSON.stringify(user));
        return user;
      } else if (res.status === 401) {
        await this.logout();
        return null;
      }
    } catch (err) {
      // Fallback to stored session if offline
    }

    if (stored) {
      return this.normalizeUser(JSON.parse(stored));
    }
    return null;
  },

  async loginWithSocial(provider: 'google' | 'facebook' | 'apple'): Promise<User> {
    const formattedProviderName = provider === 'google' ? 'Google' : provider === 'facebook' ? 'Facebook' : 'Apple';
    const providerEnum = provider.toUpperCase() as 'GOOGLE' | 'FACEBOOK' | 'APPLE';
    const email = `user.${provider}.${Date.now().toString().slice(-6)}@supermind.ai`;
    const mockUser: User = {
      id: `usr_${provider}_${Date.now()}`,
      name: `${formattedProviderName} User`,
      email,
      role: 'USER',
      authProvider: providerEnum,
      providerId: `oauth_${provider}_${Date.now()}`,
      planTier: 'Free Trial',
      tokensUsed: 0,
      tokenBudget: 100000,
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
      role: 'USER',
      authProvider: 'PHONE',
      providerId: cleanPhone,
      planTier: 'Free Trial',
      tokensUsed: 0,
      tokenBudget: 100000,
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

      const normalized = this.normalizeUser(data.user);
      localStorage.setItem('supermind_token', data.accessToken);
      localStorage.setItem('supermind_user', JSON.stringify(normalized));
      return normalized;
    } catch (err: any) {
      // Local fallback
      const mockUser: User = {
        id: 'usr_demo_101',
        name: 'Alex Developer',
        email,
        role: 'USER',
        planTier: 'Free Trial',
        tokensUsed: 0,
        tokenBudget: 100000,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('supermind_token', 'mock_jwt_token_2026');
      localStorage.setItem('supermind_user', JSON.stringify(mockUser));
      return mockUser;
    }
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const res = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email: email.trim(), password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    const normalized = this.normalizeUser(data.user);
    localStorage.setItem('supermind_token', data.accessToken);
    localStorage.setItem('supermind_user', JSON.stringify(normalized));
    return normalized;
  },

  async sendVerificationCode(
    email: string,
    purpose: 'login' | 'register' | 'forgot_password' = 'forgot_password',
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), purpose }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send verification code');
      return { success: true, message: data.message };
    } catch (err: any) {
      throw new Error(err.message || 'Could not send verification code. Please check your network.');
    }
  },

  async verifyCode(email: string, code: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) return false;
      return !!data.valid;
    } catch (err) {
      return false;
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
      const normalized = this.normalizeUser(updatedUser);
      localStorage.setItem('supermind_user', JSON.stringify(normalized));
      return normalized;
    } catch (err) {
      // Local fallback for standalone mode
      const stored = localStorage.getItem('supermind_user');
      const currentUser: User = stored ? JSON.parse(stored) : {
        id: 'usr_demo_101',
        name: 'Alex Developer',
        email: 'demo@supermind.ai',
        role: 'USER',
        planTier: 'Free Trial',
        tokensUsed: 0,
        tokenBudget: 100000,
        createdAt: new Date().toISOString(),
      };

      const newUser = this.normalizeUser({ ...currentUser, ...updatedData });
      localStorage.setItem('supermind_user', JSON.stringify(newUser));
      return newUser;
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('supermind_token');
    localStorage.removeItem('supermind_user');
  },
};
