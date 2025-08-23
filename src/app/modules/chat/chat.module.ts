import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { UserRepository } from '../user/user.repository';

import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@shared/guards/auth.guard';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, UserRepository, JwtService, AuthGuard],
  exports: [ChatService, ChatRepository],
})

export class ChatModule {}