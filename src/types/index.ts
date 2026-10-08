export type Theme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: 'USER' | 'ADMIN' | 'PRO';
  authProvider?: 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'APPLE' | 'PHONE';
  providerId?: string;
  planTier: 'Starter' | 'Pro' | 'Enterprise';
  tokensUsed: number;
  tokenBudget: number;
  createdAt: string;
}


export interface SupervisorTraceStep {
  step: number;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  details: string;
}

export interface TaskDetails {
  intent: 'Chat' | 'Coding' | 'Image Studio' | 'Deep Research' | 'Document Analysis' | 'Calculation';
  complexity: 'Low' | 'Medium' | 'High' | 'Extreme';
  capabilities: string[];
  providers: string[];
  status: 'Analyzing' | 'Routing' | 'Processing' | 'Completed' | 'Failed';
  latencyMs: number;
  costUsd: number;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  latencyMs?: number;
  costUsd?: number;
  qualityScore?: number;
  sources?: Array<{ title: string; url: string }>;
  codeSnippet?: { language: string; code: string };
  imageUrl?: string;
  supervisorTrace?: TaskDetails;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  createdAt: string;
  favorite: boolean;
  modelUsed: string;
  category: 'Chat' | 'Coding' | 'Research' | 'Images' | 'Documents';
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'TXT';
  sizeBytes: number;
  uploadedAt: string;
  status: 'Ready' | 'Processing' | 'Error';
  summary?: string;
}

export interface ImageItem {
  id: string;
  prompt: string;
  url: string;
  aspectRatio: '1:1' | '16:9' | '9:16';
  style: 'Vivid' | 'Photorealistic' | 'Anime' | 'Digital Art';
  createdAt: string;
}

export interface AnalyticsSummary {
  totalRequests: number;
  totalMessages: number;
  imagesGenerated: number;
  documentsAnalyzed: number;
  tokensConsumed: number;
  successRatePercentage: number;
  averageLatencyMs: number;
  providerStats: Array<{
    provider: string;
    model: string;
    requests: number;
    latencyMs: number;
    successRate: number;
  }>;
}
