import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'conv_101' })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({ example: 'user' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'Explain Kubernetes' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'TEXT' })
  @IsOptional()
  @IsString()
  messageType?: string;
}
