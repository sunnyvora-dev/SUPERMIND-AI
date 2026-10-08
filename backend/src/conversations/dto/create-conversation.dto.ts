import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiPropertyOptional({ example: 'Spring Boot REST Auth' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'CODING' })
  @IsOptional()
  @IsString()
  taskType?: string;

  @ApiPropertyOptional({ example: 'Coding' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Claude 3.5 Sonnet' })
  @IsOptional()
  @IsString()
  modelUsed?: string;
}

export class UpdateConversationDto {
  @ApiPropertyOptional({ example: 'Renamed Session' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  favorite?: boolean;
}
