import { Controller, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@shared/guards/auth.guard';

import { ChatService } from './chat.service';

@Controller('chats')
@UseGuards(AuthGuard) 
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

}
