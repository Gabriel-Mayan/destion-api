import { Controller, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@shared/guards/auth.guard';

import { MessageService } from './message.service';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

}
