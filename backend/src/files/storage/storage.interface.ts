export interface StorageService {
  uploadFile(file: Express.Multer.File, destinationDir?: string): Promise<{ filename: string; path: string; url: string }>;
  deleteFile(filePath: string): Promise<boolean>;
}
