import { Module } from '@nestjs/common';
import { ResponseAggregatorService } from './response-aggregator.service';
import { ResponseValidatorService } from './response-validator.service';
import { CorrectionService } from './correction.service';

@Module({
  providers: [ResponseAggregatorService, ResponseValidatorService, CorrectionService],
  exports: [ResponseAggregatorService, ResponseValidatorService, CorrectionService],
})
export class ResponsesModule {}
