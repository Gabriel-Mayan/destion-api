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
import { AuthModule } from '@modules/auth/auth.module';
import { ChatModule } from '@modules/chat/chat.module';
import { MessageModule } from '@modules/message/message.module';
import { UserModule } from '@modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { tokenConfig } from '@config/token.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: tokenConfig }),
    TypeOrmModule.forRootAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: databaseConfig }),
    MiddlewaresModule,
    RedisModule,
    SocketModule,
    PingModule,
    EmailModule,
    SentryModule,
    UserModule,
    AuthModule,
    ChatModule,
    MessageModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})

export class AppModule { }
