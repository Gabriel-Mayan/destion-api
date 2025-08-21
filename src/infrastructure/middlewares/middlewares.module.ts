import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { LoggerMiddleware } from './logger.middleware';

import { CompressorsModule } from '@infrastructure/compressors/compressor.module';

@Module({
  imports: [CompressorsModule, TypeOrmModule.forFeature([])],
})

export class MiddlewaresModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)      
      .exclude({ path: 'ping', method: RequestMethod.ALL })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
