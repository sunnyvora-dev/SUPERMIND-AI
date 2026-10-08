import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculatorTool {
  isMatch(prompt: string): boolean {
    return /^[\d\s\+\-\*\/\(\)\.]+$/.test(prompt.trim()) || prompt.toLowerCase().startsWith('calculate');
  }

  evaluate(prompt: string): { success: boolean; result: string } {
    try {
      const sanitized = prompt.replace(/calculate/i, '').replace(/[^0-9\+\-\*\/\(\)\.]/g, '');
      // Evaluate simple math safely without eval()
      const func = new Function(`return (${sanitized})`);
      const val = func();
      return { success: true, result: String(val) };
    } catch (err) {
      return { success: false, result: 'Math evaluation error' };
    }
  }
}
