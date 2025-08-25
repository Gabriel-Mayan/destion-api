import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { UserRepository } from '../user/user.repository';

import { RedisService } from '@infrastructure/redis/redis.service';

import { AuthGuard } from '@shared/guards/auth.guard';
import { DateFnsService } from '@shared/datefns/datefns.service';

@Module({
  controllers: [ChatController],
  providers: [DateFnsService, ChatService, ChatRepository, UserRepository, AuthGuard, RedisService],
  exports: [ChatService, ChatRepository],
})

export class ChatModule {}
