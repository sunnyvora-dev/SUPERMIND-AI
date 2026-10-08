import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<{ filename: string; path: string; url: string }> {
    const filename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9\.\-]/g, '_')}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      filename,
      path: filePath,
      url: `/uploads/${filename}`,
    };
  }

  async deleteFile(filePath: string): Promise<boolean> {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
}
