import { Test, TestingModule } from '@nestjs/testing';
import { ModelRouterService } from './model-router.service';
import { GeminiProvider } from '../ai/providers/gemini.provider';
import { TaskPlan } from './task-planner.service';

describe('ModelRouterService (Gemini Meta-Supervisor & 4-Model Dispatch)', () => {
  let service: ModelRouterService;
  let geminiProviderMock: Partial<GeminiProvider>;

  beforeEach(async () => {
    geminiProviderMock = {
      optimizeAndRoutePrompt: jest.fn().mockImplementation(async (prompt: string) => {
        const lower = prompt.toLowerCase();
        if (lower.includes('code') || lower.includes('python') || lower.includes('algorithm')) {
          return {
            optimizedPrompt: `[Optimized for DeepSeek] ${prompt}`,
            selectedModel: 'DeepSeek',
            rationale: 'DeepSeek excels at algorithmic coding and technical precision.',
            requiresMultiModel: false,
            modelCandidates: ['Google Gemini', 'DeepSeek', 'Kimi', 'OpenAI'],
          };
        }
        if (lower.includes('pdf') || lower.includes('document') || lower.includes('report')) {
          return {
            optimizedPrompt: `[Optimized for Kimi] ${prompt}`,
            selectedModel: 'Kimi',
            rationale: 'Kimi K3.1 Pro provides 200k+ token document context comprehension.',
            requiresMultiModel: false,
            modelCandidates: ['Google Gemini', 'DeepSeek', 'Kimi', 'OpenAI'],
          };
        }
        return {
          optimizedPrompt: `[Optimized by Gemini] ${prompt}`,
          selectedModel: 'Google Gemini',
          rationale: 'Gemini provides ultra-fast reasoning and multimodal search capabilities.',
          requiresMultiModel: false,
          modelCandidates: ['Google Gemini', 'DeepSeek', 'Kimi', 'OpenAI'],
        };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelRouterService,
        { provide: GeminiProvider, useValue: geminiProviderMock },
      ],
    }).compile();

    service = module.get<ModelRouterService>(ModelRouterService);
  });

  it('should route coding tasks to DeepSeek via Gemini meta-supervisor', async () => {
    const plan: TaskPlan = {
      intent: 'Coding',
      taskType: 'CODING',
      complexity: 'HIGH',
      category: 'Coding',
      requiresCalculation: false,
      requiresSearch: false,
      requiresMultiModel: false,
    };

    const decision = await service.routeWithGemini('Write a Python binary search algorithm with unit tests', plan);
    expect(decision.selectedModel).toBe('DeepSeek');
    expect(decision.optimizedPrompt).toContain('[Optimized for DeepSeek]');
    expect(decision.rationale).toContain('DeepSeek');
  });

  it('should route document analysis tasks to Kimi K3.1 Pro via Gemini meta-supervisor', async () => {
    const plan: TaskPlan = {
      intent: 'Document Analysis',
      taskType: 'DOCUMENT_ANALYSIS',
      complexity: 'HIGH',
      category: 'Documents',
      requiresCalculation: false,
      requiresSearch: false,
      requiresMultiModel: false,
    };

    const decision = await service.routeWithGemini('Summarize this 100-page financial report PDF', plan);
    expect(decision.selectedModel).toBe('Kimi');
    expect(decision.optimizedPrompt).toContain('[Optimized for Kimi]');
    expect(decision.rationale).toContain('Kimi');
  });

  it('should route general chat and search to Google Gemini', async () => {
    const plan: TaskPlan = {
      intent: 'Chat',
      taskType: 'GENERAL_CHAT',
      complexity: 'LOW',
      category: 'Chat',
      requiresCalculation: false,
      requiresSearch: false,
      requiresMultiModel: false,
    };

    const decision = await service.routeWithGemini('What are the key discoveries of modern astrophysics?', plan);
    expect(decision.selectedModel).toBe('Google Gemini');
    expect(decision.optimizedPrompt).toContain('[Optimized by Gemini]');
  });

  it('should fall back gracefully to plan-based models if Gemini meta-supervisor throws an error', async () => {
    (geminiProviderMock.optimizeAndRoutePrompt as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const plan: TaskPlan = {
      intent: 'Coding',
      taskType: 'CODING',
      complexity: 'HIGH',
      category: 'Coding',
      requiresCalculation: false,
      requiresSearch: false,
      requiresMultiModel: false,
    };

    const decision = await service.routeWithGemini('Write code', plan);
    expect(decision.selectedModel).toBe('DeepSeek');
    expect(decision.rationale).toContain('Fallback');
  });
});
