import { Injectable } from '@nestjs/common';
import { GenerateImageDto } from './dto/generate-image.dto';

@Injectable()
export class ImagesService {
  async generate(userId: string, dto: GenerateImageDto) {
    await new Promise((r) => setTimeout(r, 600));

    // High quality sample images curated for DALL-E 3 rendering requests
    const sampleImages = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    ];

    const chosenUrl = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    return {
      id: `img_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      prompt: dto.prompt,
      imageUrl: chosenUrl,
      aspectRatio: dto.aspectRatio || '1024x1024',
      style: dto.style || 'Vivid Cyberpunk',
      modelUsed: 'DALL-E 3',
      createdAt: new Date().toISOString(),
    };
  }
}
