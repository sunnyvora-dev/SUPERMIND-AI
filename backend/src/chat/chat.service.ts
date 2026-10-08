import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SupervisorService } from '../supervisor/supervisor.service';
import { MessagesService } from '../messages/messages.service';
import { UsageService } from '../usage/usage.service';
import { ChatPromptDto } from './dto/chat-prompt.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private supervisor: SupervisorService,
    private messagesService: MessagesService,
    private usageService: UsageService,
  ) {}

  async processChat(userId: string, dto: ChatPromptDto) {
    const prompt = dto.message.trim();
    let conversationId = dto.conversationId;
    let conversation;

    // 1. Create or Find Conversation
    if (conversationId) {
      conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          userId,
          title: prompt.length > 36 ? prompt.slice(0, 36) + '...' : prompt,
          taskType: 'GENERAL_CHAT',
          category: 'Chat',
          modelUsed: 'GPT-4o',
        },
      });
      conversationId = conversation.id;
    }

    // 2. Save User Message
    const userMsg = await this.messagesService.create({
      conversationId,
      role: 'user',
      content: prompt,
      messageType: 'TEXT',
    });

    // 3. Process Prompt through Supervisor Engine with User RAG Retrieval
    const supervisorResult = await this.supervisor.processPrompt(prompt, undefined, userId);

    // 4. Save Assistant Message
    const assistantMsg = await this.messagesService.create({
      conversationId,
      role: 'assistant',
      content: supervisorResult.content,
      messageType: supervisorResult.plan.taskType === 'IMAGE_GENERATION' ? 'IMAGE' : supervisorResult.codeSnippet ? 'CODE' : 'TEXT',
      model: supervisorResult.modelName,
      latencyMs: supervisorResult.latencyMs,
      costUsd: supervisorResult.costUsd,
      qualityScore: 0.98,
      codeSnippet: supervisorResult.codeSnippet,
      sources: supervisorResult.sources,
      supervisorTrace: supervisorResult.supervisorTrace,
    });

    // 5. Update Conversation Metadata
    const updatedConversation = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        taskType: supervisorResult.plan.taskType,
        category: supervisorResult.plan.category,
        modelUsed: supervisorResult.modelName,
        updatedAt: new Date(),
      },
    });

    // 6. Record Usage Accounting
    await this.usageService.logUsage({
      userId,
      conversationId,
      provider: supervisorResult.modelName.split(' ')[0] || 'AIProvider',
      model: supervisorResult.modelName,
      promptTokens: supervisorResult.promptTokens || 80,
      completionTokens: supervisorResult.completionTokens || 140,
      totalTokens: supervisorResult.totalTokens || 220,
      latencyMs: supervisorResult.latencyMs,
      costUsd: supervisorResult.costUsd,
    });

    return {
      conversation: updatedConversation,
      message: assistantMsg,
    };
  }
}
