import { Module } from '@nestjs/common';
import { OpenAIProvider } from './providers/openai.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { AnthropicProvider } from './providers/anthropic.provider';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { KimiProvider } from './providers/kimi.provider';
import { AIProviderRegistryService } from './providers/provider-registry.service';

@Module({
  providers: [
    OpenAIProvider,
    GeminiProvider,
    AnthropicProvider,
    DeepSeekProvider,
    KimiProvider,
    AIProviderRegistryService,
  ],
  exports: [
    AIProviderRegistryService,
    OpenAIProvider,
    GeminiProvider,
    AnthropicProvider,
    DeepSeekProvider,
    KimiProvider,
  ],
})
export class AiModule {}
