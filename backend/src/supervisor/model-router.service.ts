import { Injectable } from '@nestjs/common';
import { TaskPlan } from './task-planner.service';

@Injectable()
export class ModelRouterService {
  selectModels(plan: TaskPlan): string[] {
    // Dedicated Google Gemini AI Engine
    return ['Google Gemini'];
  }

}

