import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supermind_local_dev_jwt_secret_key_2026_super_secure',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string; role: string }) {
    const rawToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (rawToken) {
      const isBlacklisted = await this.redisService.isTokenBlacklisted(rawToken);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked/logged out');
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists or session expired');
    }

    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

