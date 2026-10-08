import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async findByConversation(conversationId: string) {
    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((m) => ({
      ...m,
      codeSnippet: m.codeSnippet ? JSON.parse(m.codeSnippet) : undefined,
      sources: m.sources ? JSON.parse(m.sources) : undefined,
      supervisorTrace: m.supervisorTrace ? JSON.parse(m.supervisorTrace) : undefined,
      timestamp: m.createdAt.toISOString(),
    }));
  }

  async create(dto: CreateMessageDto & {
    model?: string;
    latencyMs?: number;
    costUsd?: number;
    qualityScore?: number;
    codeSnippet?: any;
    sources?: any;
    supervisorTrace?: any;
  }) {
    const created = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        role: dto.role,
        content: dto.content,
        messageType: dto.messageType || 'TEXT',
        model: dto.model,
        latencyMs: dto.latencyMs,
        costUsd: dto.costUsd,
        qualityScore: dto.qualityScore,
        codeSnippet: dto.codeSnippet ? JSON.stringify(dto.codeSnippet) : null,
        sources: dto.sources ? JSON.stringify(dto.sources) : null,
        supervisorTrace: dto.supervisorTrace ? JSON.stringify(dto.supervisorTrace) : null,
      },
    });

    return {
      ...created,
      codeSnippet: dto.codeSnippet,
      sources: dto.sources,
      supervisorTrace: dto.supervisorTrace,
      timestamp: created.createdAt.toISOString(),
    };
  }
}
