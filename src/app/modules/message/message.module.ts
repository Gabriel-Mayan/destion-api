import { Module } from '@nestjs/common';

import { AuthGuard } from '@shared/guards/auth.guard';

import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageRepository, AuthGuard],
  exports: [MessageService],
})
export class MessageModule { }
