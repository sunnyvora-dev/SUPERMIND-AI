import { Injectable } from '@nestjs/common';
import { AIResponse } from '../ai/providers/ai-provider.interface';

@Injectable()
export class ResponseAggregatorService {
  aggregate(responses: AIResponse[]): AIResponse {
    if (responses.length === 0) {
      throw new Error('No AI responses provided to aggregator');
    }
    if (responses.length === 1) return responses[0];

    // Filter out fallback / mock placeholder responses if at least one real response succeeded
    const isMock = (r: AIResponse) =>
      r.content.includes('[Google Gemini Response]\n\nSuperMind synthesized insights') ||
      r.content.includes('[GPT-4o Optimized Response]\n\nSuperMind Prompt Architect refined');

    const realResponses = responses.filter((r) => !isMock(r));
    const activeResponses = realResponses.length > 0 ? realResponses : responses;

    if (activeResponses.length === 1) return activeResponses[0];

    const combinedContent = activeResponses
      .map((r, i) => `### Model Output ${i + 1} (${r.modelName})\n\n${r.content}`)
      .join('\n\n---\n\n');

    const totalPrompt = activeResponses.reduce((acc, r) => acc + r.promptTokens, 0);
    const totalComp = activeResponses.reduce((acc, r) => acc + r.completionTokens, 0);
    const totalCost = activeResponses.reduce((acc, r) => acc + r.costUsd, 0);
    const maxLatency = Math.max(...activeResponses.map((r) => r.latencyMs));

    return {
      content: `[Multi-Model Synthesized Response]\n\nSuperMind aggregated outputs from multiple models:\n\n${combinedContent}`,
      providerName: 'Aggregator',
      modelName: activeResponses.map((r) => r.modelName).join(' + '),
      promptTokens: totalPrompt,
      completionTokens: totalComp,
      totalTokens: totalPrompt + totalComp,
      latencyMs: maxLatency,
      costUsd: totalCost,
      codeSnippet: activeResponses.find((r) => r.codeSnippet)?.codeSnippet,
    };
  }
}
