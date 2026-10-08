import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Generate image via AI Studio (/api/images/generate)' })
  @Post('generate')
  async generate(@Request() req: any, @Body() dto: GenerateImageDto) {
    return this.imagesService.generate(req.user.id, dto);
  }
}
