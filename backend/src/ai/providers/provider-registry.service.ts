import { Injectable, Logger } from '@nestjs/common';
import { AIProvider, AIRequest, AIResponse } from './ai-provider.interface';
import { OpenAIProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';
import { AnthropicProvider } from './anthropic.provider';

@Injectable()
export class AIProviderRegistryService {
  private readonly logger = new Logger(AIProviderRegistryService.name);
  private providers: Map<string, AIProvider> = new Map();

  constructor(
    private openaiProvider: OpenAIProvider,
    private geminiProvider: GeminiProvider,
    private anthropicProvider: AnthropicProvider,
  ) {
    // Register primary providers
    this.registerProvider(this.openaiProvider);
    this.registerProvider(this.geminiProvider);
    this.registerProvider(this.anthropicProvider);

    // Register convenience aliases
    this.providers.set('gemini', this.geminiProvider);
    this.providers.set('google', this.geminiProvider);
    this.providers.set('gemini 1.5 flash', this.geminiProvider);
    this.providers.set('gemini 1.5 pro', this.geminiProvider);

    this.providers.set('claude', this.anthropicProvider);
    this.providers.set('claude 3.5 sonnet', this.anthropicProvider);

    this.providers.set('gpt-4o', this.openaiProvider);
    this.providers.set('gpt', this.openaiProvider);
  }

  registerProvider(provider: AIProvider) {
    this.providers.set(provider.getProviderName().toLowerCase(), provider);
    this.logger.log(`Registered AI Provider: ${provider.getProviderName()}`);
  }

  getProvider(name: string): AIProvider {
    const key = name.toLowerCase().trim();

    // Direct match
    if (this.providers.has(key)) {
      const provider = this.providers.get(key);
      if (provider && provider.isAvailable()) return provider;
    }

    // Partial key match (e.g. "gemini" inside "google gemini")
    for (const [pKey, provider] of this.providers.entries()) {
      if ((pKey.includes(key) || key.includes(pKey)) && provider.isAvailable()) {
        return provider;
      }
    }

    // If GEMINI_API_KEY is configured, prioritize Gemini when requested
    if (key.includes('gemini') || key.includes('google')) {
      return this.geminiProvider;
    }

    return this.openaiProvider;
  }

  getProviderByCapability(capability: string): AIProvider {
    for (const provider of this.providers.values()) {
      if (provider.isAvailable() && provider.getCapabilities().includes(capability)) {
        return provider;
      }
    }
    return this.openaiProvider;
  }

  async executeWithFallback(request: AIRequest, preferredProviderName?: string): Promise<AIResponse> {
    const primary = preferredProviderName ? this.getProvider(preferredProviderName) : this.getProvider('gemini');
    try {
      return await primary.generate(request);
    } catch (err) {
      this.logger.warn(`Primary provider ${primary.getProviderName()} failed. Attempting fallback...`);
      for (const fallback of this.providers.values()) {
        if (fallback !== primary && fallback.isAvailable()) {
          try {
            return await fallback.generate(request);
          } catch (e) {
            continue;
          }
        }
      }
      throw new Error('SuperMind is temporarily unable to complete this request across all AI providers.');
    }
  }
}

