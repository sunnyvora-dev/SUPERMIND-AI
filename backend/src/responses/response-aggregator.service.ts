import { Injectable } from '@nestjs/common';
import { AIResponse } from '../ai/providers/ai-provider.interface';

@Injectable()
export class ResponseAggregatorService {
  aggregate(responses: AIResponse[]): AIResponse {
    if (responses.length === 1) return responses[0];

    const combinedContent = responses
      .map((r, i) => `### Model Output ${i + 1} (${r.modelName})\n\n${r.content}`)
      .join('\n\n---\n\n');

    const totalPrompt = responses.reduce((acc, r) => acc + r.promptTokens, 0);
    const totalComp = responses.reduce((acc, r) => acc + r.completionTokens, 0);
    const totalCost = responses.reduce((acc, r) => acc + r.costUsd, 0);
    const maxLatency = Math.max(...responses.map((r) => r.latencyMs));

    return {
      content: `[Multi-Model Synthesized Response]\n\nSuperMind aggregated outputs from multiple models:\n\n${combinedContent}`,
      providerName: 'Aggregator',
      modelName: responses.map((r) => r.modelName).join(' + '),
      promptTokens: totalPrompt,
      completionTokens: totalComp,
      totalTokens: totalPrompt + totalComp,
      latencyMs: maxLatency,
      costUsd: totalCost,
    };
  }
}
