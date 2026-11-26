import { Controller, Post, Body, Req, Headers, HttpCode, HttpStatus, Ip } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AdminService } from './admin.service';

export class AdminLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsOptional()
  securityPin?: string;
}

@ApiTags('Admin Security Gateway')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Fortified isolated administrator authentication with rate limiting and audit logging' })
  @ApiResponse({ status: 200, description: 'Admin authenticated with elevated JWT session' })
  @ApiResponse({ status: 403, description: 'Forbidden - Non-admin account rejected' })
  @ApiResponse({ status: 429, description: 'Too Many Requests - Rate limited' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async adminLogin(
    @Body() dto: AdminLoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ) {
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : ip || '127.0.0.1';
    return this.adminService.adminLogin(dto, clientIp, userAgent);
  }
}
