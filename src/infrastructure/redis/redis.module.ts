import { ConfigModule } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';

import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [ConfigModule, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
