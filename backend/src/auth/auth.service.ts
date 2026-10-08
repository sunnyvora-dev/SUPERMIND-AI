import { Injectable, ConflictException, UnauthorizedException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: registerDto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email.toLowerCase(),
        passwordHash,
        ...({ emailVerified: true } as any),
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash: _, ...sanitizedUser } = user;
    return {
      accessToken: token,
      user: sanitizedUser,
    };
  }

  async login(loginDto: LoginDto) {
    const cleanEmail = loginDto.email.toLowerCase();

    // Rate limit: max 5 failed/login attempts per 5 minutes per email
    const rateCheck = await this.redisService.rateLimit(`login:${cleanEmail}`, 5, 300);
    if (!rateCheck.allowed) {
      throw new HttpException('Too many failed login attempts. Please wait 5 minutes before trying again.', HttpStatus.TOO_MANY_REQUESTS);
    }

    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash: _, ...sanitizedUser } = user;
    return {
      accessToken: token,
      user: sanitizedUser,
    };
  }

  // REDIS + MAIL-POWERED LIVE OTP & VERIFICATION
  async sendOtp(
    email: string,
    purpose: 'login' | 'register' | 'forgot_password' = 'forgot_password',
  ): Promise<{ success: boolean; code: string; message: string }> {
    const cleanEmail = email.toLowerCase();
    
    // Rate limit: max 5 requests per 10 minutes per email
    const rateCheck = await this.redisService.rateLimit(`send_otp:${cleanEmail}`, 5, 600);
    if (!rateCheck.allowed) {
      throw new HttpException('Too many verification requests. Please wait a few minutes.', HttpStatus.TOO_MANY_REQUESTS);
    }

    // Generate random 6-digit OTP code (e.g., 849201)
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Default fallback '123456' for instant demo testing or live random code
    const code = process.env.NODE_ENV === 'test' ? '123456' : randomCode;

    // Store in Redis with 300s (5 minutes) TTL
    await this.redisService.setOtp(cleanEmail, code, 300);

    // Send Live Email
    await this.mailService.sendOtpEmail(cleanEmail, code, purpose);

    return {
      success: true,
      code, // returned for frontend demo hint if desired
      message: `Verification code sent to ${cleanEmail} (Valid for 5 mins)`,
    };
  }

  async verifyOtp(email: string, code: string): Promise<{ valid: boolean }> {
    const cleanEmail = email.toLowerCase();
    const isValid = await this.redisService.verifyOtp(cleanEmail, code);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification code');
    }
    return { valid: true };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const cleanEmail = email.toLowerCase();

    // Rate limit: max 3 reset attempts per 15 minutes per email
    const rateCheck = await this.redisService.rateLimit(`reset_password:${cleanEmail}`, 3, 900);
    if (!rateCheck.allowed) {
      throw new HttpException('Too many password reset attempts. Please wait 15 minutes before trying again.', HttpStatus.TOO_MANY_REQUESTS);
    }

    const isValid = await this.redisService.verifyOtp(cleanEmail, code);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const user = await this.prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });


    return { success: true, message: 'Password successfully updated' };
  }

  async logout(token: string) {
    if (token) {
      await this.redisService.blacklistToken(token);
    }
    return { success: true, message: 'Successfully logged out and revoked JWT session token' };
  }
}

