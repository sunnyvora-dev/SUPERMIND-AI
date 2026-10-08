import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatPromptDto } from './dto/chat-prompt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Dispatch chat prompt to Supervisor multi-LLM pipeline (/api/chat)' })
  @Post()
  async processChat(@Request() req: any, @Body() dto: ChatPromptDto) {
    return this.chatService.processChat(req.user.id, dto);
  }
}
