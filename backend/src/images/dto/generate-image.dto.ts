import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateImageDto {
  @ApiProperty({ example: 'Futuristic neon cyberpunk skyline rendering in 4K resolution' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiPropertyOptional({ example: '1024x1024' })
  @IsOptional()
  @IsString()
  aspectRatio?: string;

  @ApiPropertyOptional({ example: 'Vivid Cyberpunk' })
  @IsOptional()
  @IsString()
  style?: string;
}
