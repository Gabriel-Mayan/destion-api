// message.controller.ts
import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthGuard } from '@shared/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

import { SocketGateway } from '@infrastructure/socket/socket.gateway';

import { AuthenticatedRequest } from '@shared/interfaces/authenticated-request.interface';

import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly socketGateway: SocketGateway, private readonly messageService: MessageService) { }

  @Post('send')
  async sendMessage(@Body() dto: SendMessageDto, @Req() req: AuthenticatedRequest) {
    const user = req.user;

    const message = await this.messageService.sendMessage(dto, user);

    this.socketGateway.server.to(dto.chatId).emit('message', {
      chatId: dto.chatId,
      chatName: message.chat.title,
      content: message.content,
      createdAt: message.createdAt,
      sender: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });

    return message;
  }
}
