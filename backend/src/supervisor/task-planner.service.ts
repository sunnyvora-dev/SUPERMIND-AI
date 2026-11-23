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

    const isExplicitMulti =
      lower.includes('compare') ||
      lower.includes('multi-model') ||
      lower.includes('multimodel') ||
      lower.includes('both models') ||
      lower.includes('all models') ||
      lower.includes('consensus');

    if (
      lower.includes('resume') ||
      lower.includes('cv') ||
      lower.includes('shortlist') ||
      lower.includes('document') ||
      lower.includes('pdf') ||
      lower.includes('contract') ||
      lower.includes('report')
    ) {
      return {
        intent: 'Document Analysis',
        complexity: 'MEDIUM',
        taskType: 'DOCUMENT_ANALYSIS',
        category: 'Documents',
        requiresSearch: false,
        requiresCalculation: false,
        requiresMultiModel: isExplicitMulti,
      };
    }

    if (
      lower.includes('architecture') ||
      lower.includes('artict') ||
      lower.includes('archit') ||
      lower.includes('system design') ||
      lower.includes('infrastructure') ||
      lower.includes('microservice') ||
      lower.includes('distributed') ||
      lower.includes('back end') ||
      lower.includes('backend')
    ) {
      return {
        intent: 'System Architecture',
        complexity: 'HIGH',
        taskType: 'SYSTEM_ARCHITECTURE',
        category: 'Architecture',
        requiresSearch: false,
        requiresCalculation: false,
        requiresMultiModel: isExplicitMulti,
      };
    }

    if (
      lower.includes('generate image') ||
      lower.includes('generate an image') ||
      lower.includes('create image') ||
      lower.includes('create an image') ||
      lower.includes('generate picture') ||
      lower.includes('generate a picture') ||
      lower.includes('generate photo') ||
      lower.includes('generate a photo') ||
      lower.includes('draw a') ||
      lower.includes('draw me') ||
      lower.includes('paint a') ||
      lower.includes('render an image') ||
      lower.includes('make an image')
    ) {
      return { intent: 'Image Studio', complexity: 'MEDIUM', taskType: 'IMAGE_GENERATION', category: 'Images', requiresSearch: false, requiresCalculation: false, requiresMultiModel: isExplicitMulti };
    }

    if (
      lower.includes('data:image') ||
      lower.includes('attached chart') ||
      lower.includes('attached image') ||
      lower.includes('chart') ||
      lower.includes('diagram') ||
      lower.includes('graph') ||
      lower.includes('image') ||
      lower.includes('photo') ||
      lower.includes('picture')
    ) {
      return { intent: 'Visual Multimodal Analysis', complexity: 'MEDIUM', taskType: 'MULTIMODAL_VISION', category: 'Vision', requiresSearch: false, requiresCalculation: false, requiresMultiModel: isExplicitMulti };
    }

    if (
      lower.includes('code') ||
      lower.includes('java') ||
      lower.includes('python') ||
      lower.includes('react') ||
      /\bapis?\b/i.test(lower) ||
      lower.includes('function') ||
      lower.includes('bug')
    ) {
      return { intent: 'Coding', complexity: 'HIGH', taskType: 'CODING', category: 'Coding', requiresSearch: false, requiresCalculation: false, requiresMultiModel: isExplicitMulti };
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
