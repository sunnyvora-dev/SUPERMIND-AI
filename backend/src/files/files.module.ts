import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { LocalStorageService } from './storage/local-storage.service';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [DocumentsModule],
  controllers: [FilesController],
  providers: [FilesService, LocalStorageService],
  exports: [FilesService, LocalStorageService],
})
export class FilesModule {}
