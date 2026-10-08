import { Injectable, Logger } from '@nestjs/common';
import { AIResponse } from '../ai/providers/ai-provider.interface';
import { ResponseValidatorService, ValidationResult } from './response-validator.service';

@Injectable()
export class CorrectionService {
  private readonly logger = new Logger(CorrectionService.name);
  private readonly MAX_RETRIES = 2;

  constructor(private validator: ResponseValidatorService) {}

  async autoCorrect(
    response: AIResponse,
    regenerateFn: (feedback: string) => Promise<AIResponse>,
    expectedType?: string,
  ): Promise<AIResponse> {
    let currentResponse = response;
    let attempts = 0;

    while (attempts < this.MAX_RETRIES) {
      const status = this.validator.validate(currentResponse, expectedType);
      if (status === ValidationResult.PASS || status === ValidationResult.REVIEW) {
        return currentResponse;
      }

      attempts++;
      this.logger.warn(`Response failed validation. Attempting self-correction retry ${attempts}/${this.MAX_RETRIES}...`);
      currentResponse = await regenerateFn(`Response validation failed. Please provide a complete, well-formatted answer.`);
    }

    return currentResponse;
  }
}
