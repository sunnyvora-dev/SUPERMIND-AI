import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;
  
  // In-memory fallback cache if Redis server is offline
  private fallbackMap = new Map<string, { value: string; expiresAt?: number }>();

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
          if (times > 3) return null; // Stop retrying after 3 attempts, switch to fallback
          return Math.min(times * 100, 1000);
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log(`Connected to Redis at ${redisUrl}`);
      });

      this.client.on('error', (err) => {
        if (this.isConnected) {
          this.logger.warn(`Redis connection warning: ${err.message}. Using fallback in-memory cache.`);
        }
        this.isConnected = false;
      });
    } catch (err: any) {
      this.logger.warn(`Redis initialization skipped (${err.message}). Using fallback in-memory cache.`);
      this.isConnected = false;
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch (err: any) {
        this.logger.warn(`Redis set failed, using fallback cache: ${err.message}`);
      }
    }

    // Fallback store
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.fallbackMap.set(key, { value, expiresAt });
  }

  async get(key: string): Promise<string | null> {
    if (this.isConnected && this.client) {
      try {
        return await this.client.get(key);
      } catch (err: any) {
        this.logger.warn(`Redis get failed, using fallback cache: ${err.message}`);
      }
    }

    // Fallback lookup
    const item = this.fallbackMap.get(key);
    if (!item) return null;

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.fallbackMap.delete(key);
      return null;
    }

    return item.value;
  }

  async del(key: string): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
      } catch (err: any) {
        this.logger.warn(`Redis del failed: ${err.message}`);
      }
    }
    this.fallbackMap.delete(key);
  }

  // OTP Helper Methods
  async setOtp(email: string, code: string, ttlSeconds = 300): Promise<void> {
    const key = `otp:${email.toLowerCase()}`;
    await this.set(key, code, ttlSeconds);
  }

  async verifyOtp(email: string, code: string): Promise<boolean> {
    const key = `otp:${email.toLowerCase()}`;
    const storedCode = await this.get(key);
    if (!storedCode) return false;

    // Allow static demo code '123456' or matching stored code
    if (code === storedCode || code === '123456') {
      await this.del(key);
      return true;
    }
    return false;
  }

  // Rate limiting helper
  async rateLimit(key: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number }> {
    const redisKey = `ratelimit:${key}`;
    const countStr = await this.get(redisKey);
    const currentCount = countStr ? parseInt(countStr, 10) : 0;

    if (currentCount >= limit) {
      return { allowed: false, remaining: 0 };
    }

    await this.set(redisKey, (currentCount + 1).toString(), windowSeconds);
    return { allowed: true, remaining: limit - (currentCount + 1) };
  }

  // JWT Token Revocation Blacklist Helpers
  async blacklistToken(token: string, ttlSeconds = 604800): Promise<void> {
    const key = `blacklist:${token}`;
    await this.set(key, 'revoked', ttlSeconds);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    const status = await this.get(key);
    return status === 'revoked';
  }
}

