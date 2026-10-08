import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatPromptDto {
  @ApiProperty({ example: 'Explain Kubernetes architecture simply' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ example: 'conv_101' })
  @IsOptional()
  @IsString()
  conversationId?: string;
}
