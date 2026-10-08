import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LocalStorageService } from './storage/local-storage.service';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private storage: LocalStorageService,
  ) {}

  async handleUpload(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided in request payload');
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB limit
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('File size exceeds maximum allowed 10MB limit');
    }

    const uploaded = await this.storage.uploadFile(file);

    const docRecord = await this.prisma.document.create({
      data: {
        userId,
        filename: file.originalname,
        fileType: file.mimetype || 'application/octet-stream',
        fileSize: file.size,
        filePath: uploaded.path,
      },
    });

    return {
      documentId: docRecord.id,
      filename: docRecord.filename,
      fileType: docRecord.fileType,
      fileSize: docRecord.fileSize,
      url: uploaded.url,
      createdAt: docRecord.createdAt.toISOString(),
    };
  }
}
