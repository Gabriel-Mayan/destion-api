import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;
  private subscriber: Redis;
  private readonly logger: Logger;

  constructor(private config: ConfigService) {
    this.logger = new Logger(RedisService.name);

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

  async addToSet(key: string, member: string): Promise<void> {
    await this.client.sadd(key, member);
  }

  async getSetMembers(key: string): Promise<string[]> {
    return await this.client.smembers(key);
  }

  getPubClient(): Redis {
    return this.client.duplicate();
  }

  getSubClient(): Redis {
    return this.subscriber.duplicate();
  }
}
