import { Controller, Post, Body, Req, UseGuards, Patch, Delete, Param } from '@nestjs/common';
import { AuthGuard } from '@shared/guards/auth.guard';

import { SocketGateway } from '@infrastructure/socket/socket.gateway';
import { AuthenticatedRequest } from '@shared/interfaces/authenticated-request.interface';

import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly socketGateway: SocketGateway, private readonly messageService: MessageService) { }

  @Post('send')
  async sendMessage(@Body() dto: SendMessageDto, @Req() req: AuthenticatedRequest) {
    const user = req.user;
    const message = await this.messageService.sendMessage(dto, user);

    this.socketGateway.server.to(dto.chatId).emit('message', {
      type: 'created',
      chatId: dto.chatId,
      message,
    });

    return message;
  }

  @Patch('update')
  async updateMessage(@Body() dto: UpdateMessageDto, @Req() req: AuthenticatedRequest) {
    const user = req.user;
    const updatedMessage = await this.messageService.updateMessage(dto, user);

    this.socketGateway.server.to(updatedMessage.chat.id).emit('message', {
      type: 'updated',
      chatId: updatedMessage.chat.id,
      message: updatedMessage,
    });

    return updatedMessage;
  }

  @Delete(':id')
  async deleteMessage(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const user = req.user;
    const deletedMessage = await this.messageService.deleteMessage(id, user);

    this.socketGateway.server.to(deletedMessage.chat.id).emit('message', {
      type: 'deleted',
      chatId: deletedMessage.chat.id,
      messageId: id,
    });

    return { success: true };
  }
}
