import { ImageItem } from '../types';
import { API_CONFIG } from './apiConfig';
import { authService } from './authService';

export const imageService = {
  async getImages(): Promise<ImageItem[]> {
    const stored = localStorage.getItem('supermind_images');
    if (stored) return JSON.parse(stored);
    return [];
  },

  async generateImage(
    prompt: string,
    aspectRatio: ImageItem['aspectRatio'] = '16:9',
    style: ImageItem['style'] = 'Digital Art'
  ): Promise<ImageItem> {
    const token = authService.getToken();
    if (!token) throw new Error('Unauthorized');

    const res = await fetch(`${API_CONFIG.BASE_URL}/images/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt, aspectRatio, style }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Image generation failed');
    }

    const newImg: ImageItem = {
      id: data.id,
      prompt: data.prompt,
      url: data.imageUrl,
      aspectRatio: data.aspectRatio,
      style: data.style,
      createdAt: data.createdAt,
    };

    const images = await this.getImages();
    const updated = [newImg, ...images];
    localStorage.setItem('supermind_images', JSON.stringify(updated));
    return newImg;
  },

  async deleteImage(id: string): Promise<void> {
    const images = await this.getImages();
    const filtered = images.filter((img) => img.id !== id);
    localStorage.setItem('supermind_images', JSON.stringify(filtered));
  },
};

