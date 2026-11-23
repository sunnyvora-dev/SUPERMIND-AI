import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateConversationDto, UpdateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const list = await this.prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return list.map((c) => ({
      id: c.id,
      title: c.title,
      taskType: c.taskType,
      category: c.category,
      modelUsed: c.modelUsed,
      favorite: Boolean(c.favorite),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      lastMessage: c.messages?.[0]?.content || 'No messages yet',
    }));
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

    const fav = dto.favorite !== undefined ? dto.favorite : dto.isPinned !== undefined ? dto.isPinned : undefined;

    const updated = await this.prisma.conversation.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(fav !== undefined && { favorite: fav }),
      },
    });

    return {
      ...updated,
      isPinned: updated.favorite,
      isArchived: dto.isArchived ?? false,
    };
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // ownership verification

    return this.prisma.conversation.delete({
      where: { id },
    });
  }
}
