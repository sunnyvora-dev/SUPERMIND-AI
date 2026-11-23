import { ImageItem } from '../types';
import { API_CONFIG } from './apiConfig';
import { authService } from './authService';

export const imageService = {
  async getImages(): Promise<ImageItem[]> {
    const token = authService.getToken();
    if (token) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/images`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          const mapped: ImageItem[] = (Array.isArray(data) ? data : []).map((img: any) => ({
            id: img.id,
            prompt: img.prompt,
            url: img.imageUrl,
            aspectRatio: img.aspectRatio || '1:1',
            style: img.style || 'Digital Art',
            createdAt: img.createdAt,
          }));
          localStorage.setItem('supermind_images', JSON.stringify(mapped));
          return mapped;
        }
      } catch (err) {
        console.warn('Network issue fetching account images, using local cache:', err);
      }
    }

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
    if (!token) throw new Error('Please log in to generate and save images');

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
    const updated = [newImg, ...images.filter((img) => img.id !== newImg.id)];
    localStorage.setItem('supermind_images', JSON.stringify(updated));
    return newImg;
  },

  async deleteImage(id: string): Promise<void> {
    const token = authService.getToken();
    if (token) {
      try {
        await fetch(`${API_CONFIG.BASE_URL}/images/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.warn('Failed to delete image on server:', err);
      }
    }

    const stored = localStorage.getItem('supermind_images');
    if (stored) {
      try {
        const images: ImageItem[] = JSON.parse(stored);
        const filtered = images.filter((img) => img.id !== id);
        localStorage.setItem('supermind_images', JSON.stringify(filtered));
      } catch (e) {}
    }
  },
};

