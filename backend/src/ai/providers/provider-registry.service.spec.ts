import { Test, TestingModule } from '@nestjs/testing';
import { AIProviderRegistryService } from './provider-registry.service';
import { OpenAIProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';
import { AnthropicProvider } from './anthropic.provider';

describe('AIProviderRegistryService', () => {
  let registry: AIProviderRegistryService;
  let openaiMock: any;
  let geminiMock: any;
  let anthropicMock: any;

  beforeEach(async () => {
    openaiMock = {
      getProviderName: () => 'OpenAI',
      isAvailable: jest.fn().mockReturnValue(true),
      getCapabilities: () => ['text', 'code', 'vision'],
      generate: jest.fn().mockResolvedValue({ content: 'OpenAI output', modelName: 'GPT-4o', costUsd: 0.001 }),
    };

    geminiMock = {
      getProviderName: () => 'Gemini',
      isAvailable: jest.fn().mockReturnValue(true),
      getCapabilities: () => ['text', 'multimodal', 'fast'],
      generate: jest.fn().mockResolvedValue({ content: 'Gemini output', modelName: 'Gemini 1.5 Flash', costUsd: 0.0005 }),
    };

    anthropicMock = {
      getProviderName: () => 'Anthropic',
      isAvailable: jest.fn().mockReturnValue(true),
      getCapabilities: () => ['text', 'reasoning'],
      generate: jest.fn().mockResolvedValue({ content: 'Claude output', modelName: 'Claude 3.5 Sonnet', costUsd: 0.002 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIProviderRegistryService,
        { provide: OpenAIProvider, useValue: openaiMock },
        { provide: GeminiProvider, useValue: geminiMock },
        { provide: AnthropicProvider, useValue: anthropicMock },
      ],
    }).compile();

    registry = module.get<AIProviderRegistryService>(AIProviderRegistryService);
  });

  it('should retrieve correct provider by alias', () => {
    expect(registry.getProvider('gemini').getProviderName()).toBe('Gemini');
    expect(registry.getProvider('claude').getProviderName()).toBe('Anthropic');
    expect(registry.getProvider('gpt-4o').getProviderName()).toBe('OpenAI');
  });

  it('should execute primary provider if healthy', async () => {
    const res = await registry.executeWithFallback({ prompt: 'Hello' }, 'OpenAI');
    expect(res.content).toBe('OpenAI output');
    expect(openaiMock.generate).toHaveBeenCalled();
  });

  it('should fallback to secondary provider when primary fails', async () => {
    openaiMock.generate.mockRejectedValue(new Error('Rate limit exceeded 429'));

    const res = await registry.executeWithFallback({ prompt: 'Hello' }, 'OpenAI');

    expect(res.content).toBeDefined();
    // It should have fallen back to Gemini or Anthropic
    expect(res.content).toMatch(/Gemini output|Claude output/);
  });

  it('should throw Error if all providers fail', async () => {
    openaiMock.generate.mockRejectedValue(new Error('Fail 1'));
    geminiMock.generate.mockRejectedValue(new Error('Fail 2'));
    anthropicMock.generate.mockRejectedValue(new Error('Fail 3'));

    await expect(registry.executeWithFallback({ prompt: 'Hello' }, 'OpenAI')).rejects.toThrow(
      'SuperMind is temporarily unable to complete this request across all AI providers.',
    );
  });
});
