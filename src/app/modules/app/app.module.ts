import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { jwtConfig } from '@config/jwt.config';
import { databaseConfig } from '@config/database.config';

import { PingModule } from '@infrastructure/ping/ping.module';
import { RedisModule } from '@infrastructure/redis/redis.module';
import { SocketModule } from '@infrastructure/socket/socket.module';
import { MiddlewaresModule } from '@infrastructure/middlewares/middlewares.module';

import { EmailModule } from '@integrations/email/email.module';
import { SentryModule } from '@integrations/sentry/sentry.module';

import { AuthModule } from '@modules/auth/auth.module';
import { ChatModule } from '@modules/chat/chat.module';
import { UserModule } from '@modules/user/user.module';
import { MessageModule } from '@modules/message/message.module';
import { RecoveryPasswordModule } from '@modules/recovery-password/recovery-password.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: databaseConfig }),
    JwtModule.registerAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: jwtConfig, global: true }),
    MiddlewaresModule,
    RedisModule,
    SocketModule,
    // PingModule,
    EmailModule,
    SentryModule,
    RecoveryPasswordModule,
    UserModule,
    AuthModule,
    ChatModule,
    MessageModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})

export class AppModule { }
