import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DatabaseModule } from '../database/database.module';
import { KeepAliveService } from './keep-alive.service';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController],
  providers: [KeepAliveService],
})
export class HealthModule {}
