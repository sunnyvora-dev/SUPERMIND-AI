import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsageService {
  constructor(private prisma: PrismaService) {}

  async logUsage(data: {
    userId: string;
    conversationId?: string;
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    latencyMs: number;
    costUsd: number;
  }) {
    if (data.totalTokens > 0) {
      await this.prisma.user.update({
        where: { id: data.userId },
        data: {
          tokensUsed: {
            increment: data.totalTokens,
          },
        },
      });
    }

    return this.prisma.usageRecord.create({
      data: {
        userId: data.userId,
        conversationId: data.conversationId,
        provider: data.provider,
        model: data.model,
        promptTokens: data.promptTokens,
        completionTokens: data.completionTokens,
        totalTokens: data.totalTokens,
        latencyMs: data.latencyMs,
        costUsd: data.costUsd,
      },
    });

  }
}
