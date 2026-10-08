import { Injectable } from '@nestjs/common';

export interface TaskPlan {
  intent: string;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  taskType: string;
  category: string;
  requiresSearch: boolean;
  requiresCalculation: boolean;
  requiresMultiModel: boolean;
}

@Injectable()
export class TaskPlannerService {
  planTask(prompt: string): TaskPlan {
    const lower = prompt.toLowerCase();

    if (lower.includes('image') || lower.includes('picture') || lower.includes('draw') || lower.includes('photo')) {
      return { intent: 'Image Studio', complexity: 'MEDIUM', taskType: 'IMAGE_GENERATION', category: 'Images', requiresSearch: false, requiresCalculation: false, requiresMultiModel: false };
    }

    if (lower.includes('code') || lower.includes('java') || lower.includes('python') || lower.includes('react') || lower.includes('api') || lower.includes('function') || lower.includes('bug')) {
      return { intent: 'Coding', complexity: 'HIGH', taskType: 'CODING', category: 'Coding', requiresSearch: false, requiresCalculation: false, requiresMultiModel: true };
    }

    if (lower.includes('latest') || lower.includes('search') || lower.includes('news') || lower.includes('today') || lower.includes('research')) {
      return { intent: 'Deep Research', complexity: 'MEDIUM', taskType: 'RESEARCH', category: 'Research', requiresSearch: true, requiresCalculation: false, requiresMultiModel: false };
    }

    if (lower.includes('pdf') || lower.includes('doc') || lower.includes('file') || lower.includes('summary') || lower.includes('contract')) {
      return { intent: 'Document Analysis', complexity: 'HIGH', taskType: 'DOCUMENT_ANALYSIS', category: 'Documents', requiresSearch: false, requiresCalculation: false, requiresMultiModel: false };
    }

    if (/^\d+\s*[\+\-\*\/]\s*\d+/.test(lower) || lower.includes('calculate')) {
      return { intent: 'Calculation', complexity: 'LOW', taskType: 'CALCULATION', category: 'Chat', requiresSearch: false, requiresCalculation: true, requiresMultiModel: false };
    }

    return { intent: 'Chat', complexity: 'LOW', taskType: 'GENERAL_CHAT', category: 'Chat', requiresSearch: false, requiresCalculation: false, requiresMultiModel: false };
  }
}
