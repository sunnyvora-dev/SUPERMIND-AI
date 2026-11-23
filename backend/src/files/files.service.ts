import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LocalStorageService } from './storage/local-storage.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private prisma: PrismaService,
    private storage: LocalStorageService,
    private documentsService: DocumentsService,
  ) {}

  async handleUpload(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided in request payload');
    }

    const maxSizeBytes = 30 * 1024 * 1024; // 30MB limit
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('File size exceeds maximum allowed 30MB limit');
    }

    const uploaded = await this.storage.uploadFile(file);

    // 1. Extract real text from PDF (pdf-parse), DOCX (mammoth), or plain text
    let extractedText = '';
    try {
      extractedText = await this.documentsService.extractTextFromFile(file);
      this.logger.log(`Extracted ${extractedText.length} characters from ${file.originalname}`);
    } catch (err: any) {
      this.logger.warn(`Text extraction warning for ${file.originalname}: ${err.message}`);
    }

    // 2. Persist Document Record
    const docRecord = await this.prisma.document.create({
      data: {
        userId,
        filename: file.originalname,
        fileType: file.mimetype || 'application/octet-stream',
        fileSize: file.size,
        filePath: uploaded.path,
        status: 'ready',
      },
    });

    // 3. Index Document Chunks for Hybrid Vector/RAG Retrieval
    if (extractedText && extractedText.trim().length > 0) {
      try {
        const rawChunks = this.documentsService.semanticChunkText(extractedText);
        for (let i = 0; i < rawChunks.length; i++) {
          const chunkContent = rawChunks[i];
          const dummyVector = this.documentsService.generateEmbeddingVector(chunkContent);

          try {
            await this.prisma.documentChunk.create({
              data: {
                documentId: docRecord.id,
                userId,
                chunkIndex: i + 1,
                pageNumber: Math.floor(i / 2) + 1,
                content: chunkContent,
                embedding: JSON.stringify(dummyVector),
              },
            });
          } catch {}
        }
      } catch (chunkErr: any) {
        this.logger.warn(`Failed to create chunks for ${file.originalname}: ${chunkErr.message}`);
      }
    }

    return {
      documentId: docRecord.id,
      filename: docRecord.filename,
      fileType: docRecord.fileType,
      fileSize: docRecord.fileSize,
      url: uploaded.url,
      text: extractedText,
      createdAt: docRecord.createdAt.toISOString(),
    };
  }
}
