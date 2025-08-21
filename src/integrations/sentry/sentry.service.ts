import * as Sentry from '@sentry/node';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SentryService {
  private readonly logger: Logger;

  constructor(private readonly config: ConfigService) { this.logger = new Logger(SentryService.name) }

  initialize() {
    const dsn = this.config.get<string>('SENTRY_DSN');

    if (!dsn) {
      this.logger.warn('DSN não definido, inicialização ignorada...');

      return;
    }

    Sentry.init({
      dsn,
      tracesSampleRate: 1.0,
      environment: this.config.get<string>('NODE_ENV') || 'development',
    });

    this.logger.log('Serviço inicializado com sucesso!');
  }

  captureException(error: any) {
    Sentry.captureException(error);
  }

  captureMessage(message: string) {
    Sentry.captureMessage(message);
  }
}
