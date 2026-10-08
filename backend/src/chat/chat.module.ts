import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SupervisorModule } from '../supervisor/supervisor.module';
import { MessagesModule } from '../messages/messages.module';
import { UsageModule } from '../usage/usage.module';

@Module({
  imports: [SupervisorModule, MessagesModule, UsageModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
