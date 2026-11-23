import { Injectable, Logger } from '@nestjs/common';
import { AIProvider, AIRequest, AIResponse } from './ai-provider.interface';
import { OpenAIProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';
import { AnthropicProvider } from './anthropic.provider';
import { DeepSeekProvider } from './deepseek.provider';
import { KimiProvider } from './kimi.provider';

@Injectable()
export class AIProviderRegistryService {
  private readonly logger = new Logger(AIProviderRegistryService.name);
  private providers: Map<string, AIProvider> = new Map();

  constructor(
    private openaiProvider: OpenAIProvider,
    private geminiProvider: GeminiProvider,
    private anthropicProvider: AnthropicProvider,
    private deepseekProvider: DeepSeekProvider,
    private kimiProvider: KimiProvider,
  ) {
    // Register 4 Primary Flagship Providers + Anthropic Claude
    this.registerProvider(this.geminiProvider);
    this.registerProvider(this.deepseekProvider);
    this.registerProvider(this.kimiProvider);
    this.registerProvider(this.openaiProvider);
    this.registerProvider(this.anthropicProvider);

    // Register convenience aliases for dynamic routing
    this.providers.set('gemini', this.geminiProvider);
    this.providers.set('google', this.geminiProvider);
    this.providers.set('google gemini', this.geminiProvider);
    this.providers.set('gemini 2.5 flash', this.geminiProvider);
    this.providers.set('gemini 1.5 flash', this.geminiProvider);
    this.providers.set('gemini 1.5 pro', this.geminiProvider);

    this.providers.set('deepseek', this.deepseekProvider);
    this.providers.set('deepseek flash', this.deepseekProvider);
    this.providers.set('deepseek-chat', this.deepseekProvider);
    this.providers.set('deepseek-reasoner', this.deepseekProvider);
    this.providers.set('deepseek v3', this.deepseekProvider);
    this.providers.set('deepseek r1', this.deepseekProvider);

    this.providers.set('kimi', this.kimiProvider);
    this.providers.set('kimi k3.1 pro', this.kimiProvider);
    this.providers.set('moonshot', this.kimiProvider);
    this.providers.set('moonshot-v1-128k', this.kimiProvider);

    this.providers.set('openai', this.openaiProvider);
    this.providers.set('gpt-4o', this.openaiProvider);
    this.providers.set('gpt', this.openaiProvider);

    this.providers.set('claude', this.anthropicProvider);
    this.providers.set('claude 3.5 sonnet', this.anthropicProvider);
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

    // Partial key match (e.g. "deepseek" inside "deepseek flash")
    for (const [pKey, provider] of this.providers.entries()) {
      if ((pKey.includes(key) || key.includes(pKey)) && provider.isAvailable()) {
        return provider;
      }
    }

    if (key.includes('deepseek')) return this.deepseekProvider;
    if (key.includes('kimi') || key.includes('moonshot')) return this.kimiProvider;
    if (key.includes('gemini') || key.includes('google')) return this.geminiProvider;
    if (key.includes('claude') || key.includes('anthropic')) return this.anthropicProvider;

    return this.geminiProvider;
  }

  getProviderByCapability(capability: string): AIProvider {
    for (const provider of this.providers.values()) {
      if (provider.isAvailable() && provider.getCapabilities().includes(capability)) {
        return provider;
      }
    }
    return this.geminiProvider;
  }

  getAllAvailableModelNames(): string[] {
    return ['Google Gemini', 'DeepSeek', 'Kimi', 'OpenAI'];
  }

  async executeWithFallback(request: AIRequest, preferredProviderName?: string): Promise<AIResponse> {
    const primary = preferredProviderName ? this.getProvider(preferredProviderName) : this.getProvider('gemini');
    try {
      return await primary.generate(request);
    } catch (err: any) {
      this.logger.warn(`Primary provider ${primary.getProviderName()} failed: ${err?.message}. Attempting fallback...`);
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
