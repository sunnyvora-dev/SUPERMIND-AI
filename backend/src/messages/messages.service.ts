import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async findByConversation(userId: string, conversationId: string) {
    // IDOR Defense: verify that the target conversation belongs to the authenticated user
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.userId !== userId) {
      throw new ForbiddenException('Access to conversation denied');
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((m) => {
      let codeSnippet: any = undefined;
      let sources: any = undefined;
      let supervisorTrace: any = undefined;

      try {
        if (m.codeSnippet) codeSnippet = JSON.parse(m.codeSnippet);
      } catch {}
      try {
        if (m.sources) sources = JSON.parse(m.sources);
      } catch {}
      try {
        if (m.supervisorTrace) supervisorTrace = JSON.parse(m.supervisorTrace);
      } catch {}

      return {
        ...m,
        codeSnippet,
        sources,
        supervisorTrace,
        timestamp: m.createdAt.toISOString(),
      };
    });
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
