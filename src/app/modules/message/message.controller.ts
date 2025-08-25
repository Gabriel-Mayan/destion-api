// message.controller.ts
import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthGuard } from '@shared/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedRequest } from '@shared/interfaces/authenticated-request.interface';

import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async sendMessage(@Body() dto: SendMessageDto, @Req() req: AuthenticatedRequest) {
    return await this.messageService.sendMessage(dto, req.user);
  }
}
