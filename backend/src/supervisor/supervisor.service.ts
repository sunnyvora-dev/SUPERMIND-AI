import { Injectable, Logger } from '@nestjs/common';
import { TaskPlannerService } from './task-planner.service';
import { ModelRouterService } from './model-router.service';
import { AIProviderRegistryService } from '../ai/providers/provider-registry.service';
import { CalculatorTool } from '../tools/calculator.tool';
import { SearchTool } from '../tools/search.tool';
import { ResponseAggregatorService } from '../responses/response-aggregator.service';
import { CorrectionService } from '../responses/correction.service';
import { DocumentsService } from '../documents/documents.service';
import { AIResponse } from '../ai/providers/ai-provider.interface';

@Injectable()
export class SupervisorService {
  private readonly logger = new Logger(SupervisorService.name);

  constructor(
    private taskPlanner: TaskPlannerService,
    private modelRouter: ModelRouterService,
    private providerRegistry: AIProviderRegistryService,
    private calculatorTool: CalculatorTool,
    private searchTool: SearchTool,
    private aggregator: ResponseAggregatorService,
    private correctionService: CorrectionService,
    private documentsService: DocumentsService,
  ) {}

  async processPrompt(prompt: string, userHistory?: { role: string; content: string }[], userId?: string) {
    const startTime = Date.now();

    // 1. Task Planning
    const plan = this.taskPlanner.planTask(prompt);
    this.logger.log(`Supervisor Planned Task: ${plan.taskType} (Complexity: ${plan.complexity})`);

    // 2. Calculator Tool Check (Zero token waste for math)
    if (plan.requiresCalculation && this.calculatorTool.isMatch(prompt)) {
      const calcResult = this.calculatorTool.evaluate(prompt);
      return {
        content: `Direct calculation computed without LLM token waste:\n\n**Result:** \`${calcResult.result}\``,
        modelName: 'Calculator Tool',
        plan,
        latencyMs: Date.now() - startTime,
        costUsd: 0,
        supervisorTrace: {
          intent: plan.intent,
          complexity: plan.complexity,
          capabilities: ['Fast Calculation'],
          providers: ['Local Math Engine'],
          status: 'Completed',
          latencyMs: Date.now() - startTime,
          costUsd: 0,
        },
      };
    }

    // 3. Document RAG Context Retrieval & Web Search Integration
    let sources: { title: string; url: string }[] | undefined = undefined;
    let augmentedPrompt = prompt;

    if (userId) {
      try {
        const ragChunks = await this.documentsService.hybridSearch(userId, prompt, 3);
        if (ragChunks && ragChunks.length > 0) {
          const contextText = ragChunks.map((c) => `[Source: ${c.filename}, p.${c.pageNumber}]\n${c.content}`).join('\n\n');
          augmentedPrompt = `${augmentedPrompt}\n\n[Retrieved Document RAG Context]\n${contextText}`;
          sources = ragChunks.map((c) => ({ title: `${c.filename} (p.${c.pageNumber})`, url: `#rag-${c.documentId}` }));
        }
      } catch (err: any) {
        this.logger.warn(`RAG Document Context Retrieval skipped: ${err.message}`);
      }
    }

    if (plan.requiresSearch) {
      const searchResults = await this.searchTool.search(prompt);
      const searchSources = searchResults.map((s) => ({ title: s.title, url: s.url }));
      sources = sources ? [...sources, ...searchSources] : searchSources;
      augmentedPrompt = `${augmentedPrompt}\n\n[Web Search Context]\n${searchResults.map((s) => `- ${s.title}: ${s.snippet}`).join('\n')}`;
    }

    // 4. Model Routing & Execution
    const selectedProviderNames = this.modelRouter.selectModels(plan);

    let finalResponse: AIResponse;
    if (plan.requiresMultiModel && selectedProviderNames.length > 1) {
      const responses = await Promise.all(
        selectedProviderNames.map((pName) =>
          this.providerRegistry.executeWithFallback({ prompt: augmentedPrompt, conversationHistory: userHistory }, pName),
        ),
      );
      finalResponse = this.aggregator.aggregate(responses);
    } else {
      const targetProvider = selectedProviderNames[0];
      finalResponse = await this.providerRegistry.executeWithFallback(
        { prompt: augmentedPrompt, conversationHistory: userHistory },
        targetProvider,
      );
    }

    // 5. Validation & Self-Correction (Max 2 retries)
    finalResponse = await this.correctionService.autoCorrect(
      finalResponse,
      (feedback) =>
        this.providerRegistry.executeWithFallback(
          { prompt: `${augmentedPrompt}\n\n[Feedback]: ${feedback}`, conversationHistory: userHistory },
          selectedProviderNames[0],
        ),
      plan.taskType,
    );

    return {
      content: finalResponse.content,
      modelName: finalResponse.modelName,
      codeSnippet: finalResponse.codeSnippet,
      sources,
      plan,
      latencyMs: Date.now() - startTime,
      costUsd: finalResponse.costUsd,
      promptTokens: finalResponse.promptTokens || 0,
      completionTokens: finalResponse.completionTokens || 0,
      totalTokens: finalResponse.totalTokens || 0,
      supervisorTrace: {
        intent: plan.intent,
        complexity: plan.complexity,
        capabilities: ['Intent Classification', 'Model Routing', 'Quality Validation'],
        providers: [finalResponse.modelName],
        status: 'Completed',
        latencyMs: Date.now() - startTime,
        costUsd: finalResponse.costUsd,
      },
    };
  }
}
