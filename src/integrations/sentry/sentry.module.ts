import { ConfigModule } from '@nestjs/config';
import { Module, OnModuleInit } from '@nestjs/common';

import { SentryService } from './sentry.service';

@Module({
  imports: [ConfigModule],
  providers: [SentryService],
  exports: [SentryService],
})
export class SentryModule implements OnModuleInit {
  constructor(private readonly sentryService: SentryService) {}

  onModuleInit() {
    this.sentryService.initialize();
  }
}
