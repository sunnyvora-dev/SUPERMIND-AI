import { Module } from '@nestjs/common';
import { OpenAIProvider } from './providers/openai.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { AnthropicProvider } from './providers/anthropic.provider';
import { AIProviderRegistryService } from './providers/provider-registry.service';

@Module({
  providers: [
    OpenAIProvider,
    GeminiProvider,
    AnthropicProvider,
    AIProviderRegistryService,
  ],
  exports: [
    AIProviderRegistryService,
    OpenAIProvider,
    GeminiProvider,
    AnthropicProvider,
  ],
})
export class AiModule {}

