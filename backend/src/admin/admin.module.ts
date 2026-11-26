import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminAuthController } from './admin-auth.controller';
import { AdminService } from './admin.service';
import { DatabaseModule } from '../database/database.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    DatabaseModule,
    AiModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supermind_local_dev_jwt_secret_key_2026_super_secure',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AdminAuthController, AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
