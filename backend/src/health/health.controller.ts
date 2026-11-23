import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { PrismaService } from '../database/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness and readiness health probe' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  async check(@Res() res: Response) {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      return res.status(HttpStatus.OK).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        database: 'healthy',
        environment: process.env.NODE_ENV || 'development',
      });
    } catch (err: any) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'degraded',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        database: 'disconnected',
        message: err?.message || 'Database ping failed',
      });
    }
  }
}
