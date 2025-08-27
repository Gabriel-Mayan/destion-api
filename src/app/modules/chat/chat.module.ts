import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';

import { AuthGuard } from '@shared/guards/auth.guard';
import { SocketGateway } from '@infrastructure/socket/socket.gateway';
import { WsAuthMiddleware } from '@infrastructure/middlewares/ws-auth.middleware';
import { UserRepository } from '@modules/user/user.repository';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, UserRepository, AuthGuard, WsAuthMiddleware, SocketGateway],
  exports: [ChatService, ChatRepository],
})

export class ChatModule {}
