import { Module } from '@nestjs/common';

import { AuthGuard } from '@shared/guards/auth.guard';

import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { UserRepository } from '@modules/user/user.repository';
import { ChatRepository } from '@modules/chat/chat.repository';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageRepository, ChatRepository, UserRepository, AuthGuard],
  exports: [MessageService],
})
export class MessageModule { }
