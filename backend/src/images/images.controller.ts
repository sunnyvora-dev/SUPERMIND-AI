import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { GenerateImageDto } from './dto/generate-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Images')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiOperation({ summary: 'Get all generated images for current user account (/api/images)' })
  @Get()
  async getImages(@Request() req: any) {
    return this.imagesService.getUserImages(req.user.id);
  }

  @ApiOperation({ summary: 'Generate image via AI Studio (/api/images/generate)' })
  @Post('generate')
  async generate(@Request() req: any, @Body() dto: GenerateImageDto) {
    return this.imagesService.generate(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Delete generated image from user account (/api/images/:id)' })
  @Delete(':id')
  async deleteImage(@Request() req: any, @Param('id') id: string) {
    return this.imagesService.deleteImage(req.user.id, id);
  }
}
