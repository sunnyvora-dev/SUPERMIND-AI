import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto, UpdateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @ApiOperation({ summary: 'Get all user conversations' })
  @Get()
  async findAll(@Request() req: any) {
    return this.conversationsService.findAll(req.user.id);
  }

  @ApiOperation({ summary: 'Get specific conversation with message trajectory' })
  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.conversationsService.findOne(req.user.id, id);
  }

  @ApiOperation({ summary: 'Create new prompt session' })
  @Post()
  async create(@Request() req: any, @Body() dto: CreateConversationDto) {
    return this.conversationsService.create(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Update conversation title or favorite status' })
  @Patch(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateConversationDto) {
    return this.conversationsService.update(req.user.id, id, dto);
  }

  @ApiOperation({ summary: 'Delete conversation session' })
  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.conversationsService.remove(req.user.id, id);
  }
}
