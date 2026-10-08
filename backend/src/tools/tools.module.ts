import { Module } from '@nestjs/common';
import { CalculatorTool } from './calculator.tool';
import { SearchTool } from './search.tool';

@Module({
  providers: [CalculatorTool, SearchTool],
  exports: [CalculatorTool, SearchTool],
})
export class ToolsModule {}
