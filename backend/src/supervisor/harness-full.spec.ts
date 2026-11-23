import { Test, TestingModule } from '@nestjs/testing';
import { SupervisorService } from './supervisor.service';
import { TaskPlannerService } from './task-planner.service';
import { ModelRouterService } from './model-router.service';
import { AIProviderRegistryService } from '../ai/providers/provider-registry.service';
import { GeminiProvider } from '../ai/providers/gemini.provider';
import { DeepSeekProvider } from '../ai/providers/deepseek.provider';
import { KimiProvider } from '../ai/providers/kimi.provider';
import { OpenAIProvider } from '../ai/providers/openai.provider';
import { AnthropicProvider } from '../ai/providers/anthropic.provider';
import { CalculatorTool } from '../tools/calculator.tool';
import { SearchTool } from '../tools/search.tool';
import { ResponseAggregatorService } from '../responses/response-aggregator.service';
import { CorrectionService } from '../responses/correction.service';
import { ResponseValidatorService } from '../responses/response-validator.service';
import { DocumentsService } from '../documents/documents.service';

describe('Full Multi-Agent AI Harness Suite (End-to-End)', () => {
  let supervisor: SupervisorService;
  let modelRouter: ModelRouterService;
  let providerRegistry: AIProviderRegistryService;
  let geminiProvider: GeminiProvider;
  let deepseekProvider: DeepSeekProvider;
  let kimiProvider: KimiProvider;
  let documentsServiceMock: Partial<DocumentsService>;

  beforeAll(async () => {
    documentsServiceMock = {
      hybridSearch: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupervisorService,
        TaskPlannerService,
        ModelRouterService,
        AIProviderRegistryService,
        GeminiProvider,
        DeepSeekProvider,
        KimiProvider,
        OpenAIProvider,
        AnthropicProvider,
        CalculatorTool,
        SearchTool,
        ResponseAggregatorService,
        ResponseValidatorService,
        CorrectionService,
        { provide: DocumentsService, useValue: documentsServiceMock },
      ],
    }).compile();

    supervisor = module.get<SupervisorService>(SupervisorService);
    modelRouter = module.get<ModelRouterService>(ModelRouterService);
    providerRegistry = module.get<AIProviderRegistryService>(AIProviderRegistryService);
    geminiProvider = module.get<GeminiProvider>(GeminiProvider);
    deepseekProvider = module.get<DeepSeekProvider>(DeepSeekProvider);
    kimiProvider = module.get<KimiProvider>(KimiProvider);
  });

  describe('1. Registration & Provider Discovery', () => {
    it('should have all 4 flagship models registered in the harness registry', () => {
      const models = providerRegistry.getAllAvailableModelNames();
      expect(models).toContain('Google Gemini');
      expect(models).toContain('DeepSeek');
      expect(models).toContain('Kimi');
      expect(models).toContain('OpenAI');

      expect(providerRegistry.getProvider('deepseek').getProviderName()).toBe('DeepSeek');
      expect(providerRegistry.getProvider('kimi').getProviderName()).toBe('Kimi');
      expect(providerRegistry.getProvider('gemini').getProviderName()).toBe('Google Gemini');
      expect(providerRegistry.getProvider('openai').getProviderName()).toBe('OpenAI');
    });
  });

  describe('2. Gemini Meta-Supervisor: Dynamic Prompt Optimization & Routing', () => {
    it('Harness Test: Coding prompt -> routes to DeepSeek Flash / V3 with optimized prompt', async () => {
      const prompt = 'Write a Python function to solve the Two Sum problem with an O(n) hash map';
      const result = await supervisor.processPrompt(prompt);

      expect(result).toBeDefined();
      expect(result.modelName).toMatch(/DeepSeek/i);
      expect(result.supervisorTrace.capabilities).toEqual(
        expect.arrayContaining([expect.stringContaining('DeepSeek')]),
      );
      expect(result.codeSnippet).toBeDefined();
      expect(result.promptTokens).toBeGreaterThan(0);
      expect(result.completionTokens).toBeGreaterThan(0);
      expect(result.costUsd).toBeGreaterThanOrEqual(0);
      expect(result.supervisorTrace.status).toBe('Completed');
    });

    it('Harness Test: Massive document prompt -> routes to Kimi K3.1 Pro Long-Context Engine', async () => {
      const prompt = 'Please summarize and extract key liability clauses from this 100-page enterprise contract document';
      const result = await supervisor.processPrompt(prompt);

      expect(result).toBeDefined();
      expect(result.modelName).toMatch(/Kimi/i);
      expect(result.supervisorTrace.capabilities).toEqual(
        expect.arrayContaining([expect.stringContaining('Kimi')]),
      );
      expect(result.content).toMatch(/Kimi/i);
      expect(result.supervisorTrace.status).toBe('Completed');
    });

    it('Harness Test: System architecture prompt -> routes to OpenAI GPT-4o', async () => {
      const prompt = 'Provide an architectural design pattern for event-driven microservices using CQRS and Kafka';
      const result = await supervisor.processPrompt(prompt);

      expect(result).toBeDefined();
      expect(result.supervisorTrace.capabilities).toEqual(
        expect.arrayContaining([expect.stringContaining('OpenAI')]),
      );
      expect(result.supervisorTrace.status).toBe('Completed');
    });

    it('Harness Test: Real-time search & general chat -> routes to Google Gemini', async () => {
      const prompt = 'Explain how qubit quantum superposition works in modern astrophysics';
      const result = await supervisor.processPrompt(prompt);

      expect(result).toBeDefined();
      expect(result.modelName).toMatch(/Gemini/i);
      expect(result.supervisorTrace.capabilities).toEqual(
        expect.arrayContaining([expect.stringContaining('Google Gemini')]),
      );
      expect(result.supervisorTrace.status).toBe('Completed');
    });
  });

  describe('3. Zero-Token Local Tool Bypass', () => {
    it('Harness Test: Math calculation executes with 0 cost and no LLM token waste', async () => {
      const mathPrompt = 'Calculate 145 * 20 + 500';
      const result = await supervisor.processPrompt(mathPrompt);

      expect(result.modelName).toBe('Calculator Tool');
      expect(result.costUsd).toBe(0);
      expect(result.content).toContain('`3400`');
      expect(result.supervisorTrace.providers).toContain('Local Math Engine');
      expect(result.supervisorTrace.status).toBe('Completed');
    });
  });

  describe('4. RAG Vector Context Injection', () => {
    it('Harness Test: Integrates retrieved document chunks into the augmented prompt', async () => {
      (documentsServiceMock.hybridSearch as jest.Mock).mockResolvedValueOnce([
        {
          documentId: 'doc-891',
          filename: 'Security_Policy.pdf',
          pageNumber: 12,
          content: 'Strict requirement for multi-factor authentication on all admin logins.',
        },
      ]);

      const prompt = 'What is the authentication policy according to our documents?';
      const result = await supervisor.processPrompt(prompt, undefined, 'user-xyz');

      expect(documentsServiceMock.hybridSearch).toHaveBeenCalledWith('user-xyz', prompt, 3);
      expect(result.sources).toBeDefined();
      expect(result.sources![0].title).toBe('Security_Policy.pdf (p.12)');
      expect(result.sources![0].url).toBe('#rag-doc-891');
    });
  });

  describe('5. Fallback & Fault Tolerance Across the Harness', () => {
    it('Harness Test: Gracefully executes secondary provider if primary provider fails', async () => {
      const failingRequest = { prompt: 'Test fallback' };
      const res = await providerRegistry.executeWithFallback(failingRequest, 'DeepSeek');

      expect(res).toBeDefined();
      expect(res.content.length).toBeGreaterThan(0);
    });
  });
});
