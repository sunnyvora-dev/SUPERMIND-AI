import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DocumentsService (RAG Pipeline & Security Suite)', () => {
  let service: DocumentsService;
  let prismaService: any;

  beforeEach(async () => {
    prismaService = {
      document: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      documentChunk: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  describe('uploadDocument & Async Ingestion', () => {
    it('should create document record with pending status and trigger chunk ingestion', async () => {
      const mockDoc = {
        id: 'doc-1',
        userId: 'user-1',
        filename: 'test.txt',
        fileType: 'TXT',
        fileSize: 100,
        filePath: 'uploads/test.txt',
        status: 'pending',
      };
      prismaService.document.create.mockResolvedValue(mockDoc);
      prismaService.document.update.mockResolvedValue({ ...mockDoc, status: 'ready' });
      prismaService.documentChunk.create.mockResolvedValue({});

      const file = {
        originalname: 'test.txt',
        mimetype: 'text/plain',
        size: 100,
        buffer: Buffer.from('SuperMind RAG artificial intelligence contextual knowledge retrieval engine.'),
      };

      const result = await service.uploadDocument('user-1', file);
      expect(prismaService.document.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          filename: 'test.txt',
          fileType: 'TXT',
          status: 'pending',
        }),
      });
      expect(result.id).toBe('doc-1');
    });

    it('extreme edge: handle zero-byte buffer without crashing', async () => {
      const mockDoc = { id: 'doc-zero', userId: 'user-1', filename: 'empty.txt', status: 'pending' };
      prismaService.document.create.mockResolvedValue(mockDoc);
      prismaService.document.update.mockResolvedValue({ ...mockDoc, status: 'ready' });
      prismaService.documentChunk.create.mockResolvedValue({});

      const file = { originalname: 'empty.txt', mimetype: 'text/plain', size: 0, buffer: Buffer.from('') };
      const res = await service.uploadDocument('user-1', file);
      expect(res.id).toBe('doc-zero');
    });

    it('extreme edge: handle large document string with multi-lingual unicode characters', async () => {
      const unicodeContent = 'SuperMind AI 🚀🤖 智能系统 System Multi-Lingual \n\n' + 'Context block two '.repeat(100);
      const mockDoc = { id: 'doc-unicode', userId: 'user-1', filename: 'unicode.txt', status: 'pending' };
      prismaService.document.create.mockResolvedValue(mockDoc);
      prismaService.document.update.mockResolvedValue({ ...mockDoc, status: 'ready' });

      const file = { originalname: 'unicode.txt', mimetype: 'text/plain', size: unicodeContent.length, buffer: Buffer.from(unicodeContent) };
      const res = await service.uploadDocument('user-1', file);
      expect(res.id).toBe('doc-unicode');
    });
  });

  describe('hybridSearch & Multi-Tenant Data Isolation', () => {
    it('should throw BadRequestException if userId is missing', async () => {
      await expect(service.hybridSearch('', 'query')).rejects.toThrow(BadRequestException);
    });

    it('STRICT SECURITY TEST: filter chunks at DB level by userId to prevent cross-user data leaks', async () => {
      const mockChunksUserA = [
        {
          id: 'chunk-1',
          documentId: 'doc-1',
          userId: 'user-A',
          pageNumber: 1,
          content: 'Secret confidential roadmap for User A.',
          embedding: JSON.stringify(new Array(128).fill(0.1)),
          document: { filename: 'secret_a.pdf', status: 'ready' },
        },
      ];

      prismaService.documentChunk.findMany.mockImplementation((args: any) => {
        // Enforce mock matching DB behavior
        if (args.where.userId === 'user-B') {
          return Promise.resolve([]);
        }
        return Promise.resolve(mockChunksUserA);
      });

      // User A searches
      const resultsUserA = await service.hybridSearch('user-A', 'confidential roadmap');
      expect(resultsUserA.length).toBe(1);
      expect(resultsUserA[0].content).toContain('Secret confidential roadmap for User A');

      // User B searches exact same term
      const resultsUserB = await service.hybridSearch('user-B', 'confidential roadmap');
      expect(resultsUserB.length).toBe(0); // MUST NEVER RETURN USER A DATA
      expect(prismaService.documentChunk.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ userId: 'user-B' }) }),
      );
    });
  });

  describe('deleteDocument', () => {
    it('should delete document if user matches', async () => {
      prismaService.document.findUnique.mockResolvedValue({ id: 'doc-1', userId: 'user-1' });
      prismaService.document.delete.mockResolvedValue({});

      const res = await service.deleteDocument('user-1', 'doc-1');
      expect(res.success).toBe(true);
      expect(prismaService.document.delete).toHaveBeenCalledWith({ where: { id: 'doc-1' } });
    });

    it('should throw NotFoundException if document belongs to another user', async () => {
      prismaService.document.findUnique.mockResolvedValue({ id: 'doc-1', userId: 'other-user' });

      await expect(service.deleteDocument('user-1', 'doc-1')).rejects.toThrow(NotFoundException);
    });
  });
});
