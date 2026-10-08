import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { MailService } from '../mail/mail.service';
import { ConflictException, UnauthorizedException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService (Extreme Unit & Edge Suite)', () => {
  let authService: AuthService;
  let prismaService: any;
  let jwtService: any;
  let redisService: any;
  let mailService: any;

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked.jwt.token'),
    };

    redisService = {
      rateLimit: jest.fn().mockResolvedValue({ allowed: true }),
      setOtp: jest.fn().mockResolvedValue(true),
      verifyOtp: jest.fn().mockResolvedValue(true),
      blacklistToken: jest.fn().mockResolvedValue(true),
    };

    mailService = {
      sendOtpEmail: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaService },
        { provide: JwtService, useValue: jwtService },
        { provide: RedisService, useValue: redisService },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should successfully register a new user and return JWT + sanitized user', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockImplementation((args: any) =>
        Promise.resolve({
          id: 'user-123',
          email: args.data.email,
          name: args.data.name,
          role: 'USER',
          passwordHash: args.data.passwordHash,
          avatarUrl: args.data.avatarUrl,
        }),
      );

      const result = await authService.register({
        email: 'Test.User@Example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
      });

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test.user@example.com' } });
      expect(result.accessToken).toBe('mocked.jwt.token');
      expect(result.user.email).toBe('test.user@example.com');
      expect((result.user as any).passwordHash).toBeUndefined();
    });

    it('should throw ConflictException if email is already registered', async () => {
      prismaService.user.findUnique.mockResolvedValue({ id: 'existing-user', email: 'existing@example.com' });

      await expect(
        authService.register({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Existing User',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('extreme edge: handle SQL injection strings in email safely without breaking', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockImplementation((args: any) =>
        Promise.resolve({ id: 'fuzz-1', email: args.data.email, role: 'USER' }),
      );

      const sqlInjectionEmail = "admin' OR '1'='1'--@example.com";
      const result = await authService.register({
        email: sqlInjectionEmail,
        password: 'password123',
        name: "<script>alert('XSS')</script>",
      });

      expect(result.user.email).toBe(sqlInjectionEmail.toLowerCase());
    });
  });

  describe('login', () => {
    it('should login user with correct credentials and return accessToken', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-999',
        email: 'user@example.com',
        passwordHash: hashedPassword,
        role: 'PRO',
      });
      prismaService.user.update.mockResolvedValue({});

      const result = await authService.login({ email: 'USER@example.com', password: 'password123' });

      expect(result.accessToken).toBe('mocked.jwt.token');
      expect(result.user.id).toBe('user-999');
      expect(prismaService.user.update).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'nonexistent@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-999',
        email: 'user@example.com',
        passwordHash: hashedPassword,
      });

      await expect(
        authService.login({ email: 'user@example.com', password: 'wrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('extreme edge: rate limit exceeded should throw 429 TOO_MANY_REQUESTS', async () => {
      redisService.rateLimit.mockResolvedValue({ allowed: false });

      await expect(
        authService.login({ email: 'spammer@example.com', password: 'any' }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('sendOtp & verifyOtp & resetPassword', () => {
    it('should send OTP and return success response', async () => {
      const res = await authService.sendOtp('user@test.com', 'forgot_password');
      expect(res.success).toBe(true);
      expect(redisService.setOtp).toHaveBeenCalledWith('user@test.com', expect.any(String), 300);
      expect(mailService.sendOtpEmail).toHaveBeenCalled();
    });

    it('should throw BadRequestException on invalid verifyOtp code', async () => {
      redisService.verifyOtp.mockResolvedValue(false);
      await expect(authService.verifyOtp('user@test.com', '000000')).rejects.toThrow(BadRequestException);
    });

    it('should successfully reset password when OTP is valid', async () => {
      redisService.verifyOtp.mockResolvedValue(true);
      prismaService.user.findUnique.mockResolvedValue({ id: 'user-id-1', email: 'user@test.com' });
      prismaService.user.update.mockResolvedValue({});

      const res = await authService.resetPassword('user@test.com', '123456', 'NewPassword123!');
      expect(res.success).toBe(true);
      expect(prismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should blacklist JWT token upon logout', async () => {
      const res = await authService.logout('sample.token.here');
      expect(res.success).toBe(true);
      expect(redisService.blacklistToken).toHaveBeenCalledWith('sample.token.here');
    });
  });
});
