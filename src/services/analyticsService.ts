import { AnalyticsSummary } from '../types';
import { API_CONFIG } from './apiConfig';
import { authService } from './authService';

export const analyticsService = {
  async getAnalytics(): Promise<AnalyticsSummary> {
    const token = authService.getToken();
    if (!token) {
      return {
        totalRequests: 0,
        totalMessages: 0,
        imagesGenerated: 0,
        documentsAnalyzed: 0,
        tokensConsumed: 0,
        successRatePercentage: 100,
        averageLatencyMs: 0,
        providerStats: [],
      };
    }

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/analytics/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      return {
        totalRequests: data.overview?.totalRequests || 0,
        totalMessages: data.overview?.totalMessages || 0,
        imagesGenerated: data.overview?.imagesGenerated || 0,
        documentsAnalyzed: data.overview?.documentsAnalyzed || 0,
        tokensConsumed: data.overview?.totalTokens || 0,
        successRatePercentage: data.overview?.successRatePercentage || 99.8,
        averageLatencyMs: data.overview?.avgLatencyMs || 0,
        taskDistribution: data.taskDistribution || [],
        providerStats: data.providerStats || [],
      };
    } catch (err) {
      return {
        totalRequests: 0,
        totalMessages: 0,
        imagesGenerated: 0,
        documentsAnalyzed: 0,
        tokensConsumed: 0,
        successRatePercentage: 100,
        averageLatencyMs: 0,
        providerStats: [],
      };
    }
  },
};
