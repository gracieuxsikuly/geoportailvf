import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.config.get<number>('PORT', 3001);
  }

  get geoserverUrl(): string {
    return this.config.getOrThrow<string>('GEOSERVER_URL');
  }

  get geoserverAdminUser(): string | undefined {
    return this.config.get<string>('GEOSERVER_ADMIN_USER');
  }

  get geoserverAdminPassword(): string | undefined {
    return this.config.get<string>('GEOSERVER_ADMIN_PASSWORD');
  }

  get frontendUrl(): string {
    return this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
  }

  get corsOrigins(): string[] {
    const raw = this.config.get<string>('CORS_ORIGINS', 'http://localhost:3000');
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }

  get rateLimitTtl(): number {
    return this.config.get<number>('RATE_LIMIT_TTL', 60);
  }

  get rateLimitMax(): number {
    return this.config.get<number>('RATE_LIMIT_MAX', 100);
  }

  get logLevel(): string {
    return this.config.get<string>('LOG_LEVEL', 'info');
  }
}
