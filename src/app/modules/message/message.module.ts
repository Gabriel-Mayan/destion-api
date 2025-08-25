import { Module } from '@nestjs/common';

import { AuthGuard } from '@shared/guards/auth.guard';

import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { UserRepository } from '@modules/user/user.repository';
import { ChatRepository } from '@modules/chat/chat.repository';
import { SocketGateway } from '@infrastructure/socket/socket.gateway';
import { WsAuthMiddleware } from '@infrastructure/middlewares/ws-auth.middleware';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageRepository, ChatRepository, UserRepository,WsAuthMiddleware, SocketGateway, AuthGuard],
  exports: [MessageService],
})
export class MessageModule { }
