import { Injectable, Logger, Optional } from '@nestjs/common';
import { TaskPlannerService } from './task-planner.service';
import { ModelRouterService } from './model-router.service';
import { AIProviderRegistryService } from '../ai/providers/provider-registry.service';
import { CalculatorTool } from '../tools/calculator.tool';
import { SearchTool } from '../tools/search.tool';
import { ResponseAggregatorService } from '../responses/response-aggregator.service';
import { CorrectionService } from '../responses/correction.service';
import { DocumentsService } from '../documents/documents.service';
import { ImagesService } from '../images/images.service';
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
    @Optional() private imagesService?: ImagesService,
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

    // 2.5 AI Image Studio Generation (Direct visual diffusion synthesis)
    if (plan.taskType === 'IMAGE_GENERATION' && this.imagesService) {
      try {
        const cleanPrompt = prompt
          .replace(/^(please\s+)?(can\s+you\s+)?(generate|create|draw|paint|render|make)\s+(an?\s+)?(image|picture|photo|illustration|graphic)\s+(of\s+)?/i, '')
          .trim();
        const imgRes = await this.imagesService.generate(userId || 'anon', {
          prompt: cleanPrompt || prompt,
          aspectRatio: '1:1',
          style: 'Digital Art',
        });

        return {
          content: `### 🎨 AI Generated Image\n\n![${cleanPrompt || prompt}](${imgRes.imageUrl})\n\n**Prompt:** *${cleanPrompt || prompt}*\n**Style:** ${imgRes.style} • **Aspect Ratio:** ${imgRes.aspectRatio} • **Model:** ${imgRes.modelUsed}`,
          modelName: imgRes.modelUsed,
          plan,
          latencyMs: Date.now() - startTime,
          costUsd: 0.002,
          supervisorTrace: {
            intent: plan.intent,
            complexity: plan.complexity,
            capabilities: ['Visual Diffusion Synthesis', 'Grok Image Engine'],
            providers: [imgRes.modelUsed],
            status: 'Completed',
            latencyMs: Date.now() - startTime,
            costUsd: 0.002,
          },
        };
      } catch (imgErr: any) {
        this.logger.warn(`Direct image generation error: ${imgErr.message}. Continuing fallback.`);
      }
    }

    // 3. Gemini Meta-Supervisor: Intelligent Decision & Prompt Optimization
    let selectedModel = 'Google Gemini';
    let routingRationale = 'Gemini dynamic routing decision';
    let optimizedPrompt = prompt;
    let requiresMulti = plan.requiresMultiModel;

    if (this.modelRouter && typeof this.modelRouter.routeWithGemini === 'function') {
      try {
        const decision = await this.modelRouter.routeWithGemini(prompt, plan);
        selectedModel = decision.selectedModel;
        routingRationale = decision.rationale;
        optimizedPrompt = decision.optimizedPrompt || prompt;
        if (decision.requiresMultiModel) {
          requiresMulti = true;
        }
      } catch (err: any) {
        this.logger.warn(`routeWithGemini failed: ${err.message}. Falling back.`);
        const models = this.modelRouter.selectModels(plan);
        selectedModel = models[0] || 'Google Gemini';
      }
    } else if (this.modelRouter && typeof this.modelRouter.selectModels === 'function') {
      const models = this.modelRouter.selectModels(plan);
      selectedModel = models[0] || 'Google Gemini';
    }

    // 4. Document RAG Context Retrieval & Web Search Integration
    let sources: { title: string; url: string }[] | undefined = undefined;
    let augmentedPrompt = optimizedPrompt;

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

    // 5. Model Execution
    let finalResponse: AIResponse;
    if (requiresMulti) {
      const targetModels = [selectedModel, selectedModel === 'Google Gemini' ? 'DeepSeek' : 'Google Gemini'];
      const responses = await Promise.all(
        targetModels.map((pName) =>
          this.providerRegistry.executeWithFallback({ prompt: augmentedPrompt, conversationHistory: userHistory }, pName),
        ),
      );
      finalResponse = this.aggregator.aggregate(responses);
    } else {
      finalResponse = await this.providerRegistry.executeWithFallback(
        { prompt: augmentedPrompt, conversationHistory: userHistory },
        selectedModel,
      );
    }

    // 6. Validation & Self-Correction (Max 2 retries)
    finalResponse = await this.correctionService.autoCorrect(
      finalResponse,
      (feedback) =>
        this.providerRegistry.executeWithFallback(
          { prompt: `${augmentedPrompt}\n\n[Feedback]: ${feedback}`, conversationHistory: userHistory },
          selectedModel,
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
        capabilities: [
          'Gemini Prompt Optimization',
          `Gemini Decision: ${selectedModel}`,
          routingRationale,
          'Quality Validation',
        ],
        providers: [finalResponse.modelName],
        status: 'Completed',
        latencyMs: Date.now() - startTime,
        costUsd: finalResponse.costUsd,
      },
    };
  }
}
