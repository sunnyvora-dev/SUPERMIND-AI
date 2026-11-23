import { Injectable, Logger, Optional } from '@nestjs/common';
import { GenerateImageDto } from './dto/generate-image.dto';
import { PrismaService } from '../database/prisma.service';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(@Optional() private readonly prisma?: PrismaService) {}

  async generate(userId: string, dto: GenerateImageDto) {
    const startTime = Date.now();
    dotenv.config();
    dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env'), override: true });
    dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: false });

    const apiKey = (
      process.env.SCALEMAX_API_KEY ||
      process.env.AI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      ''
    ).trim();

    const rawBaseUrl = (
      process.env.BASE_URL ||
      'https://api.scalemax.pro/token/v1'
    ).replace(/\/+$/, '');

    // 1. Style-aware prompt enhancement
    const style = dto.style || 'Digital Art';
    let styleSuffix = '';
    switch (style.toLowerCase()) {
      case 'photorealistic':
        styleSuffix = ', 8k resolution, highly detailed, photorealistic, professional photography, hyperrealistic, master shot';
        break;
      case 'anime':
        styleSuffix = ', anime illustration, makoto shinkai aesthetic, vibrant colors, detailed line art, masterpiece';
        break;
      case 'vivid':
        styleSuffix = ', vivid concept art, cinematic volumetric lighting, dramatic contrast, unreal engine 5 render, trending on artstation';
        break;
      default:
        styleSuffix = ', vibrant digital art, highly detailed, intricate, sharp focus, 4k';
        break;
    }

    const enhancedPrompt = `${dto.prompt}${styleSuffix}`;
    const rawAspectRatio = dto.aspectRatio || '1:1';
    const aspectRatio = rawAspectRatio === '16:9' || rawAspectRatio === '9:16' ? rawAspectRatio : '1:1';

    let imageUrl = '';
    let modelUsed = 'Grok Imagine';

    // 2. Try ScaleMax live AI Image Generation
    if (apiKey && apiKey.length > 0) {
      const endpoint = `${rawBaseUrl}/images/generations`;
      this.logger.log(`Dispatching live image generation to ScaleMax API at: ${endpoint}...`);

      const candidateModels = [
        { model: 'grok-imagine-image', size: aspectRatio },
        { model: 'gpt-image-1.5', size: '1024x1024' },
      ];

      for (const candidate of candidateModels) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            signal: AbortSignal.timeout(18000),
            body: JSON.stringify({
              model: candidate.model,
              prompt: enhancedPrompt,
              size: candidate.size,
              n: 1,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const item = data.data?.[0];
            if (item?.b64_json) {
              imageUrl = `data:image/png;base64,${item.b64_json}`;
              modelUsed = candidate.model === 'grok-imagine-image' ? 'Grok Imagine (ScaleMax)' : 'GPT-Image 1.5 (ScaleMax)';

              // Save copy to local uploads/generated directory for persistence
              try {
                const uploadsDir = path.join(process.cwd(), 'uploads', 'generated');
                if (!fs.existsSync(uploadsDir)) {
                  fs.mkdirSync(uploadsDir, { recursive: true });
                }
                const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.png`;
                await fs.promises.writeFile(path.join(uploadsDir, filename), Buffer.from(item.b64_json, 'base64'));
              } catch (saveErr: any) {
                this.logger.warn(`Failed to cache image to uploads directory: ${saveErr.message}`);
              }
              break;
            } else if (item?.url) {
              imageUrl = item.url;
              modelUsed = candidate.model === 'grok-imagine-image' ? 'Grok Imagine (ScaleMax)' : 'GPT-Image 1.5 (ScaleMax)';
              break;
            }
          } else {
            const errText = await res.text();
            this.logger.warn(`ScaleMax image generation failed for ${candidate.model} (${res.status}): ${errText}`);
          }
        } catch (callErr: any) {
          this.logger.warn(`ScaleMax image call error on ${candidate.model}: ${callErr.message}`);
        }
      }
    }

    // 3. Ultra-reliable Flux Engine Fallback (Pollinations AI)
    if (!imageUrl) {
      this.logger.log(`Using high-fidelity Pollinations Flux image synthesis fallback...`);
      let width = 1024;
      let height = 1024;
      if (aspectRatio === '16:9') {
        width = 1280;
        height = 720;
      } else if (aspectRatio === '9:16') {
        width = 720;
        height = 1280;
      }

      const seed = Math.floor(Math.random() * 10000000);
      imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;
      modelUsed = 'Flux 1.0 (AI Studio)';
    }

    const latencyMs = Date.now() - startTime;
    let dbImageId = `img_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    let dbCreatedAt = new Date().toISOString();

    if (this.prisma && userId && userId !== 'anon') {
      try {
        const saved = await this.prisma.image.create({
          data: {
            userId,
            prompt: dto.prompt,
            imageUrl,
            aspectRatio,
            model: modelUsed,
          },
        });
        dbImageId = saved.id;
        dbCreatedAt = saved.createdAt.toISOString();
        this.logger.log(`Image saved to user account gallery: ${saved.id}`);
      } catch (saveErr: any) {
        this.logger.warn(`Failed to persist image to database: ${saveErr.message}`);
      }

      try {
        await this.prisma.usageRecord.create({
          data: {
            userId,
            provider: 'Grok Imagine',
            model: modelUsed,
            promptTokens: 40,
            completionTokens: 40,
            totalTokens: 80,
            latencyMs,
            costUsd: 0.002,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Failed to log image usage: ${err.message}`);
      }
    }

    return {
      id: dbImageId,
      prompt: dto.prompt,
      imageUrl,
      aspectRatio,
      style,
      modelUsed,
      createdAt: dbCreatedAt,
      latencyMs,
    };
  }

  async getUserImages(userId: string) {
    if (!this.prisma || !userId) return [];
    try {
      const records = await this.prisma.image.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((r) => ({
        id: r.id,
        prompt: r.prompt,
        imageUrl: r.imageUrl,
        aspectRatio: r.aspectRatio,
        modelUsed: r.model,
        createdAt: r.createdAt.toISOString(),
      }));
    } catch (err: any) {
      this.logger.warn(`Failed to query user images: ${err.message}`);
      return [];
    }
  }

  async deleteImage(userId: string, imageId: string) {
    if (!this.prisma || !userId) return { success: false };
    try {
      await this.prisma.image.deleteMany({
        where: { id: imageId, userId },
      });
      return { success: true };
    } catch (err: any) {
      this.logger.warn(`Failed to delete user image ${imageId}: ${err.message}`);
      return { success: false, message: err.message };
    }
  }
}
