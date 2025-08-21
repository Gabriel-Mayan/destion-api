import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor(private config: ConfigService) {
    this.client = new Redis({
      host: this.config.get<string>('REDIS_HOST'),
      port: Number(this.config.get<string>('REDIS_PORT')),
    });
  }

  // TODO Configurar o redis

  onModuleDestroy() {
    this.client.disconnect();
  }
}
