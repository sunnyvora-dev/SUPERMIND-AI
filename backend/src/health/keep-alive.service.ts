import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeepAliveService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KeepAliveService.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const isProd = process.env.NODE_ENV === 'production';
    const externalUrl =
      this.configService.get<string>('RENDER_EXTERNAL_URL') ||
      this.configService.get<string>('KEEP_ALIVE_URL') ||
      (isProd ? 'https://supermind-ai.onrender.com' : null);

    if (externalUrl) {
      const pingUrl = `${externalUrl.replace(/\/+$/, '')}/api/health`;
      this.logger.log(`[KeepAlive] Initialized self-ping service for: ${pingUrl} (every 12 mins)`);

      // Ping every 12 minutes (720,000 ms) to keep Render free tier awake (15-min timeout)
      this.timer = setInterval(async () => {
        try {
          const res = await fetch(pingUrl, {
            headers: { 'User-Agent': 'SuperMind-KeepAlive/1.0' },
            signal: AbortSignal.timeout(10000),
          });
          if (res.ok) {
            this.logger.log(`[KeepAlive] Auto-ping succeeded: ${pingUrl} (${res.status} OK)`);
          } else {
            this.logger.warn(`[KeepAlive] Auto-ping returned non-200: ${res.status}`);
          }
        } catch (err: any) {
          this.logger.warn(`[KeepAlive] Auto-ping notice: ${err.message}`);
        }
      }, 12 * 60 * 1000);
    }
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
