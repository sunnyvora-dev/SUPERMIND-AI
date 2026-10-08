export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  conversationHistory?: { role: string; content: string }[];
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  providerName: string;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  costUsd: number;
  codeSnippet?: {
    language: string;
    code: string;
  };
  sources?: {
    title: string;
    url: string;
  }[];
}

export interface AIProvider {
  getProviderName(): string;
  getCapabilities(): string[];
  isAvailable(): boolean;
  generate(request: AIRequest): Promise<AIResponse>;
}
