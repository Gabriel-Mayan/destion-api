import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { databaseConfig } from '@config/database.config';

import { PingModule } from '@infrastructure/ping/ping.module';

import { EmailModule } from '@integrations/email/email.module';
import { SentryModule } from '@integrations/sentry/sentry.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MiddlewaresModule } from '@infrastructure/middlewares/middlewares.module';
import { RedisModule } from '@infrastructure/redis/redis.module';
import { SocketModule } from '@infrastructure/socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: databaseConfig }),
    MiddlewaresModule,
    RedisModule,
    SocketModule,
    PingModule,
    EmailModule,
    SentryModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})

export class AppModule { }
