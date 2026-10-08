import { Module } from '@nestjs/common';
import { TaskPlannerService } from './task-planner.service';
import { ModelRouterService } from './model-router.service';
import { SupervisorService } from './supervisor.service';
import { AiModule } from '../ai/ai.module';
import { ToolsModule } from '../tools/tools.module';
import { ResponsesModule } from '../responses/responses.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [AiModule, ToolsModule, ResponsesModule, DocumentsModule],
  providers: [TaskPlannerService, ModelRouterService, SupervisorService],
  exports: [SupervisorService, TaskPlannerService, ModelRouterService],
})
export class SupervisorModule {}
