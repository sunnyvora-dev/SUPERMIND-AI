import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User successfully created and authenticated' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiResponse({ status: 200, description: 'User authenticated and JWT returned' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Send 6-digit OTP verification code via Redis cache' })
  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  async sendOtp(@Body() body: { email: string; purpose?: 'login' | 'register' | 'forgot_password' }) {
    return this.authService.sendOtp(body.email, body.purpose || 'forgot_password');
  }

  @ApiOperation({ summary: 'Verify 6-digit OTP code against Redis' })
  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; code: string }) {
    return this.authService.verifyOtp(body.email, body.code);
  }

  @ApiOperation({ summary: 'Reset user password using Redis OTP validation' })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; code: string; newPassword: string }) {
    return this.authService.resetPassword(body.email, body.code, body.newPassword);
  }

  @ApiOperation({ summary: 'Logout and revoke JWT session token in Redis blacklist' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '') || '';
    return this.authService.logout(token);
  }
}

