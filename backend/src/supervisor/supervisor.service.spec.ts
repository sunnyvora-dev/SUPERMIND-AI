import { Test, TestingModule } from '@nestjs/testing';
import { SupervisorService } from './supervisor.service';
import { TaskPlannerService } from './task-planner.service';
import { ModelRouterService } from './model-router.service';
import { AIProviderRegistryService } from '../ai/providers/provider-registry.service';
import { CalculatorTool } from '../tools/calculator.tool';
import { SearchTool } from '../tools/search.tool';
import { ResponseAggregatorService } from '../responses/response-aggregator.service';
import { CorrectionService } from '../responses/correction.service';
import { DocumentsService } from '../documents/documents.service';

describe('SupervisorService (Multi-Model Orchestration & RAG Suite)', () => {
  let supervisorService: SupervisorService;
  let taskPlanner: any;
  let modelRouter: any;
  let providerRegistry: any;
  let calculatorTool: any;
  let searchTool: any;
  let aggregator: any;
  let correctionService: any;
  let documentsService: any;

  beforeEach(async () => {
    taskPlanner = {
      planTask: jest.fn().mockReturnValue({
        intent: 'General Query',
        taskType: 'GENERAL_CHAT',
        complexity: 'simple',
        requiresCalculation: false,
        requiresSearch: false,
        requiresMultiModel: false,
      }),
    };

    modelRouter = {
      selectModels: jest.fn().mockReturnValue(['OpenAI']),
    };

    providerRegistry = {
      executeWithFallback: jest.fn().mockResolvedValue({
        content: 'Response from OpenAI',
        modelName: 'GPT-4o',
        costUsd: 0.001,
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
      }),
    };

    calculatorTool = {
      isMatch: jest.fn().mockReturnValue(false),
      evaluate: jest.fn().mockReturnValue({ result: '4' }),
    };

    searchTool = {
      search: jest.fn().mockResolvedValue([{ title: 'Doc Search', url: 'https://example.com', snippet: 'Result' }]),
    };

    aggregator = {
      aggregate: jest.fn().mockImplementation((responses) => responses[0]),
    };

    correctionService = {
      autoCorrect: jest.fn().mockImplementation((response) => Promise.resolve(response)),
    };

    documentsService = {
      hybridSearch: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupervisorService,
        { provide: TaskPlannerService, useValue: taskPlanner },
        { provide: ModelRouterService, useValue: modelRouter },
        { provide: AIProviderRegistryService, useValue: providerRegistry },
        { provide: CalculatorTool, useValue: calculatorTool },
        { provide: SearchTool, useValue: searchTool },
        { provide: ResponseAggregatorService, useValue: aggregator },
        { provide: CorrectionService, useValue: correctionService },
        { provide: DocumentsService, useValue: documentsService },
      ],
    }).compile();

    supervisorService = module.get<SupervisorService>(SupervisorService);
  });

  it('should use calculator tool fast-path for mathematical expressions with zero token cost', async () => {
    taskPlanner.planTask.mockReturnValue({
      intent: 'Math Calculation',
      taskType: 'MATH',
      complexity: 'simple',
      requiresCalculation: true,
    });
    calculatorTool.isMatch.mockReturnValue(true);
    calculatorTool.evaluate.mockReturnValue({ result: '42' });

    const res = await supervisorService.processPrompt('21 * 2');

    expect(res.costUsd).toBe(0);
    expect(res.content).toContain('Direct calculation computed without LLM token waste');
    expect(res.modelName).toBe('Calculator Tool');
    expect(providerRegistry.executeWithFallback).not.toHaveBeenCalled();
  });

  it('should route general prompt through Model Router and execute via Provider Registry', async () => {
    const res = await supervisorService.processPrompt('What is quantum computing?');

    expect(res.content).toBe('Response from OpenAI');
    expect(res.modelName).toBe('GPT-4o');
    expect(res.supervisorTrace).toBeDefined();
    expect(res.supervisorTrace.status).toBe('Completed');
  });

  it('should inject RAG document chunks into context when userId is provided and chunks exist', async () => {
    documentsService.hybridSearch.mockResolvedValue([
      {
        chunkId: 'c1',
        documentId: 'doc1',
        filename: 'report.pdf',
        pageNumber: 3,
        content: 'SuperMind RAG context data.',
        score: 0.95,
      },
    ]);

    const res = await supervisorService.processPrompt('Explain company policy', [], 'user-123');

    expect(documentsService.hybridSearch).toHaveBeenCalledWith('user-123', 'Explain company policy', 3);
    expect(providerRegistry.executeWithFallback).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('[Retrieved Document RAG Context]'),
      }),
      'OpenAI',
    );
    expect(res.sources).toBeDefined();
    expect(res.sources![0].title).toBe('report.pdf (p.3)');
  });

  it('extreme edge: multi-model aggregation when requiresMultiModel is true', async () => {
    taskPlanner.planTask.mockReturnValue({
      intent: 'Complex Reasoning',
      taskType: 'ANALYSIS',
      complexity: 'complex',
      requiresMultiModel: true,
    });
    modelRouter.selectModels.mockReturnValue(['OpenAI', 'Gemini']);
    aggregator.aggregate.mockReturnValue({
      content: 'Consensus Analysis',
      modelName: 'Consensus (GPT-4o + Gemini 1.5 Pro)',
      costUsd: 0.005,
    });

    const res = await supervisorService.processPrompt('Analyze economic trends');

    expect(res.content).toBe('Consensus Analysis');
    expect(aggregator.aggregate).toHaveBeenCalled();
  });

  it('extreme edge: handles RAG document search exception gracefully without crashing main flow', async () => {
    documentsService.hybridSearch.mockRejectedValue(new Error('DB Connection Timeout'));

    const res = await supervisorService.processPrompt('Query during DB glitch', [], 'user-123');

    expect(res.content).toBe('Response from OpenAI');
  });
});
