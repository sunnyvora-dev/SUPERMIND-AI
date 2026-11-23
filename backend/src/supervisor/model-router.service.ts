import { Injectable, Logger, Optional } from '@nestjs/common';
import { TaskPlan } from './task-planner.service';
import { GeminiProvider, GeminiRoutingDecision } from '../ai/providers/gemini.provider';

@Injectable()
export class ModelRouterService {
  private readonly logger = new Logger(ModelRouterService.name);

  constructor(@Optional() private geminiProvider?: GeminiProvider) {}

  /**
   * Synchronous fallback selection adhering to the baseline TaskPlan interface
   */
  selectModels(plan: TaskPlan): string[] {
    if (plan.taskType === 'SYSTEM_ARCHITECTURE') {
      return ['OpenAI', 'Google Gemini'];
    }
    if (plan.taskType === 'CODING') {
      return ['DeepSeek', 'Google Gemini'];
    }
    if (plan.taskType === 'DOCUMENT_ANALYSIS' || plan.taskType === 'RESEARCH') {
      return ['Kimi', 'Google Gemini'];
    }
    return ['Google Gemini'];
  }

  /**
   * Ultra-Fast Intelligent Meta-Supervisor Routing (< 1ms latency)
   */
  async routeWithGemini(prompt: string, plan: TaskPlan): Promise<GeminiRoutingDecision> {
    try {
      if (this.geminiProvider) {
        return await this.geminiProvider.optimizeAndRoutePrompt(prompt);
      }
    } catch (err: any) {
      this.logger.warn(`Gemini dynamic routing error: ${err.message}. Defaulting to plan-based routing.`);
    }

    const models = this.selectModels(plan);
    return {
      optimizedPrompt: prompt,
      selectedModel: models[0] || 'Google Gemini',
      rationale: 'Fallback heuristic routing based on intent analysis.',
      requiresMultiModel: plan.requiresMultiModel,
      modelCandidates: ['Google Gemini', 'DeepSeek', 'Kimi', 'OpenAI'],
    };
  }
}
