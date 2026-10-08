import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateConversationDto, UpdateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.userId !== userId) {
      throw new ForbiddenException('Access to conversation denied');
    }

    return conversation;
  }

  async create(userId: string, dto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        userId,
        title: dto.title || 'New Prompt Session',
        taskType: dto.taskType || 'GENERAL_CHAT',
        category: dto.category || 'Chat',
        modelUsed: dto.modelUsed || 'GPT-4o',
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateConversationDto) {
    await this.findOne(userId, id); // ownership verification

    return this.prisma.conversation.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.favorite !== undefined && { favorite: dto.favorite }),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // ownership verification

    return this.prisma.conversation.delete({
      where: { id },
    });
  }
}
