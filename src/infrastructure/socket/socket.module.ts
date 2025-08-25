import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ConfigService } from '@nestjs/config';

import { UserRepository } from '@modules/user/user.repository';

import { WsAuthMiddleware } from '@infrastructure/middlewares/ws-auth.middleware';

@Module({
  providers: [SocketGateway, WsAuthMiddleware, UserRepository, ConfigService],
  exports: [SocketGateway],
})
export class SocketModule {}
