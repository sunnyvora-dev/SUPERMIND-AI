import { API_CONFIG } from './apiConfig';
import { authService } from './authService';

export interface AdminKPIs {
  users: {
    total: number;
    active24h: number;
    newInPeriod: number;
    suspended: number;
    tiers: {
      FREE_TRIAL: number;
      STARTER: number;
      PRO: number;
      ENTERPRISE: number;
    };
    roles: Array<{ role: string; count: number }>;
  };
  aiUsage: {
    totalRequests: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    avgLatencyMs: number;
    totalConversations: number;
    totalMessages: number;
    providerDistribution: Array<{
      provider: string;
      requests: number;
      tokens: number;
      costUsd: number;
      avgLatencyMs: number;
    }>;
    modelDistribution: Array<{
      model: string;
      requests: number;
      tokens: number;
      costUsd: number;
    }>;
  };
  financial: {
    grossRevenue: number;
    subscriptionRevenue: number;
    providerExpenses: number;
    estimatedGrossProfit: number;
    refunds: number;
    outstandingPayments: number;
  };
  systemStatus: {
    uptimeSeconds: number;
    dbStatus: string;
    redisStatus: string;
    serverTime: string;
  };
}

export interface AdminUserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  tier: string;
  plan: string;
  tokensUsed: number;
  tokenBudget: number;
  isSuspended: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  conversationsCount: number;
  totalTokensUsed: number;
  totalCostUsd: number;
}

export interface AdminUsersResponse {
  users: AdminUserItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminModelItem {
  id: string;
  name: string;
  provider: string;
  category: string;
  tier: string;
  contextWindow: number;
  costPer1kPrompt: number;
  costPer1kCompletion: number;
  isEnabled: boolean;
  capabilities: {
    vision: boolean;
    reasoning: boolean;
    coding: boolean;
    webSearch: boolean;
    audio: boolean;
  };
  stats: {
    requestsCount: number;
    totalTokens: number;
    avgLatencyMs: number;
    totalCostUsd: number;
  };
}

export interface AdminProviderItem {
  id: string;
  name: string;
  endpoint: string;
  status: 'CONNECTED' | 'DEGRADED' | 'DISCONNECTED';
  modelsCount: number;
  requests24h: number;
  avgLatencyMs: number;
  providerExpense: number;
  successRate: string;
  lastPingMs?: number;
}

export interface AdminHealthData {
  status: 'HEALTHY' | 'DEGRADED' | 'OUTAGE';
  timestamp: string;
  uptimeSeconds: number;
  nodeVersion: string;
  platform: string;
  memory: {
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
  };
  database: {
    status: string;
    latencyMs: number;
  };
  redis: {
    status: string;
  };
  providers: Array<{
    id: string;
    name: string;
    isConfigured: boolean;
    models: number;
  }>;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: any;
  ipAddress: string;
  createdAt: string;
}

export interface AuditLogsResponse {
  logs: AuditLogItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class AdminApiClient {
  private getHeaders(): HeadersInit {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}/admin${endpoint}`;
    const headers = {
      ...this.getHeaders(),
      ...(options.headers || {}),
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMessage = `Admin API error: ${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        if (body.message) {
          errorMessage = Array.isArray(body.message) ? body.message.join(', ') : body.message;
        }
      } catch {}
      throw new Error(errorMessage);
    }

    return res.json();
  }

  async getOverview(days = 30): Promise<AdminKPIs> {
    return this.request<AdminKPIs>(`/overview?days=${days}`);
  }

  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    tier?: string;
    role?: string;
  } = {}): Promise<AdminUsersResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.tier) query.set('tier', params.tier);
    if (params.role) query.set('role', params.role);
    const qs = query.toString();
    return this.request<AdminUsersResponse>(`/users${qs ? `?${qs}` : ''}`);
  }

  async getUserDetails(id: string): Promise<any> {
    return this.request<any>(`/users/${id}`);
  }

  async updateUserRole(id: string, role: string): Promise<any> {
    return this.request<any>(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async updateUserTier(id: string, tier: string): Promise<any> {
    return this.request<any>(`/users/${id}/tier`, {
      method: 'PATCH',
      body: JSON.stringify({ tier }),
    });
  }

  async toggleUserStatus(id: string, isSuspended: boolean): Promise<any> {
    return this.request<any>(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isSuspended }),
    });
  }

  async getModels(): Promise<AdminModelItem[]> {
    return this.request<AdminModelItem[]>('/models');
  }

  async toggleModel(modelId: string, isEnabled: boolean): Promise<any> {
    return this.request<any>('/models/toggle', {
      method: 'PATCH',
      body: JSON.stringify({ modelId, isEnabled }),
    });
  }

  async getProviders(): Promise<AdminProviderItem[]> {
    return this.request<AdminProviderItem[]>('/providers');
  }

  async getApiUsage(params: { days?: number; provider?: string; model?: string } = {}): Promise<any> {
    const query = new URLSearchParams();
    if (params.days) query.set('days', String(params.days));
    if (params.provider) query.set('provider', params.provider);
    if (params.model) query.set('model', params.model);
    const qs = query.toString();
    return this.request<any>(`/api-usage${qs ? `?${qs}` : ''}`);
  }

  async getSystemHealth(): Promise<AdminHealthData> {
    return this.request<AdminHealthData>('/system-health');
  }

  async getAuditLogs(params: { limit?: number; offset?: number; action?: string } = {}): Promise<AuditLogsResponse> {
    const query = new URLSearchParams();
    if (params.limit) query.set('limit', String(params.limit));
    if (params.offset) query.set('offset', String(params.offset));
    if (params.action) query.set('action', params.action);
    const qs = query.toString();
    return this.request<AuditLogsResponse>(`/audit-logs${qs ? `?${qs}` : ''}`);
  }

  async getBilling(): Promise<any> {
    return this.request<any>('/billing');
  }

  async getSettings(): Promise<any> {
    return this.request<any>('/settings');
  }

  async updateSettings(settings: Record<string, any>): Promise<any> {
    return this.request<any>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }
}

export const adminService = new AdminApiClient();
