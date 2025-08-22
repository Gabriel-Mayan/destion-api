import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

import { HttpService } from '@shared/http/http.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PingService implements OnApplicationBootstrap {
  private host: string;
  private readonly logger: Logger;

  constructor(private config: ConfigService, private http: HttpService) {
    this.logger = new Logger(PingService.name);
    this.host = this.config.get<string>('RENDER_HOST')!;
  }

  private sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  onApplicationBootstrap() {
    void this.onInitService();
  }

  private async onInitService() {
    this.logger.log('PingService started, executing initial ping...');
    const status = await this.pingRender();

    if (!status) {
      this.logger.warn('Initial ping failed, starting retry...');

      await this.retryPing(() => this.pingRender());
    }
  }

  private async pingRender(): Promise<boolean> {
    if (!this.host) {
      this.logger.warn('RENDER_HOST not configured.');
      return false;
    }

    try {
      await this.http.get(`${this.host}/ping`);

      return true;
    } catch (error) {
      this.logger.error('Error pinging the API');
      return false;
    }
  }

  private async retryPing(fn: () => Promise<boolean>, delay = 5000, maxAttempts = 10): Promise<void> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;
      const success = await fn();

      if (success) {
        this.logger.log(`Success after ${attempts} attempt(s).`);
        return;
      }

      this.logger.warn(`Attempt ${attempts} failed. Retrying in ${delay}ms...`);

      await this.sleep(delay);
    }

    this.logger.error(`Failed after ${attempts} attempts. No further retries.`);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.log('Executing scheduled ping...');
    const status = await this.pingRender();

    if (!status) {
      this.logger.warn('Ping failed, starting retry...');

      await this.retryPing(() => this.pingRender());
    }
  }
}
