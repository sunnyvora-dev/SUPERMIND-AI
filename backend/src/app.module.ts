import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { SupervisorModule } from './supervisor/supervisor.module';
import { AiModule } from './ai/ai.module';
import { ToolsModule } from './tools/tools.module';
import { ResponsesModule } from './responses/responses.module';
import { ChatModule } from './chat/chat.module';
import { FilesModule } from './files/files.module';
import { ImagesModule } from './images/images.module';
import { DocumentsModule } from './documents/documents.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UsageModule } from './usage/usage.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    DatabaseModule,
    RedisModule,
    MailModule,
    AuthModule,
    UsersModule,
    ConversationsModule,
    MessagesModule,
    SupervisorModule,
    AiModule,
    ToolsModule,
    ResponsesModule,
    ChatModule,
    FilesModule,
    ImagesModule,
    DocumentsModule,
    AnalyticsModule,
    UsageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
