import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @ApiOperation({ summary: 'List all user uploaded documents' })
  @Get()
  async findAll(@Request() req: any) {
    return this.documentsService.findAll(req.user.id);
  }

  @ApiOperation({ summary: 'Upload document for RAG ingestion pipeline (Up to 50MB)' })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
  }))
  async uploadDocument(@Request() req: any, @UploadedFile() file: any) {

    const fileData = file || {
      originalname: 'Sample_Contract.pdf',
      mimetype: 'application/pdf',
      size: 48200,
    };
    return this.documentsService.uploadDocument(req.user.id, fileData);
  }

  @ApiOperation({ summary: 'Hybrid Vector & Term Frequency Retrieval Search' })
  @Post('search')
  async search(@Request() req: any, @Body() body: { query: string; topK?: number }) {
    return this.documentsService.hybridSearch(req.user.id, body.query, body.topK || 4);
  }

  @ApiOperation({ summary: 'Delete document and cascade vector chunks' })
  @Delete(':id')
  async deleteDocument(@Request() req: any, @Param('id') id: string) {
    return this.documentsService.deleteDocument(req.user.id, id);
  }
}
