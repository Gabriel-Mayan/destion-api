import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [SocketGateway, ConfigService],
  exports: [SocketGateway],
})
export class SocketModule {}
