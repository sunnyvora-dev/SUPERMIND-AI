import { Injectable } from '@nestjs/common';
import { AIResponse } from '../ai/providers/ai-provider.interface';

export enum ValidationResult {
  PASS = 'PASS',
  REVIEW = 'REVIEW',
  FAIL = 'FAIL',
}

@Injectable()
export class ResponseValidatorService {
  validate(response: AIResponse, expectedType?: string): ValidationResult {
    if (!response || !response.content || response.content.trim().length === 0) {
      return ValidationResult.FAIL;
    }

    if (expectedType === 'CODING' && !response.content.includes('function') && !response.content.includes('class') && !response.codeSnippet) {
      return ValidationResult.REVIEW;
    }

    return ValidationResult.PASS;
  }
}
