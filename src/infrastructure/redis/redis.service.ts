import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis as RedisOri } from 'ioredis';  // 🔹 TODO Eventualmente renomear
import Redis from 'ioredis-mock'; // 🔹 TODO Eventualmente remover

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisOri;
  private subscriber: RedisOri;
  private readonly logger: Logger;

  constructor(private config: ConfigService) {
    this.logger = new Logger(RedisService.name);
  }

  async onModuleInit() {
    this.client = new Redis({
      host: this.config.get<string>('REDIS_HOST'),
      port: Number(this.config.get<string>('REDIS_PORT')),
    });

    this.subscriber = this.client.duplicate();

    this.client.on('connect', () => this.logger.log('✅ Redis conectado'));
    this.client.on('error', (err) => this.logger.error('❌ Redis error', err));
  }

  async onModuleDestroy() {
    await this.client.quit();
    await this.subscriber.quit();
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.client.get(key);

    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async publish(channel: string, message: any): Promise<void> {
    await this.client.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    await this.subscriber.subscribe(channel);

    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(JSON.parse(message));
      }
    });
  }
}
