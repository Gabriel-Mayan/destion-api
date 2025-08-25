import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { UserRepository } from '../user/user.repository';

import { AuthGuard } from '@shared/guards/auth.guard';
import { DateFnsService } from '@shared/datefns/datefns.service';
import { WsAuthMiddleware } from '@infrastructure/middlewares/ws-auth.middleware';
import { SocketGateway } from '@infrastructure/socket/socket.gateway';

@Module({
  controllers: [ChatController],
  providers: [DateFnsService, ChatService, ChatRepository, UserRepository, AuthGuard, WsAuthMiddleware, SocketGateway],
  exports: [ChatService, ChatRepository],
})

export class ChatModule {}
