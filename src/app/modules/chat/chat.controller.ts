import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';

import { AuthGuard } from '@shared/guards/auth.guard';
import { AuthenticatedRequest } from '@shared/interfaces/authenticated-request.interface';

import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SocketGateway } from '@infrastructure/socket/socket.gateway';

@Controller('chats')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly socketGateway: SocketGateway) { }

  @Post()
  create(@Body() dto: CreateChatDto, @Req() req: AuthenticatedRequest) {
    dto.creatorId = req.user.id;

    return this.chatService.createChat(dto);
  }

  @Get('me')
  async findMyChats(@Req() req: AuthenticatedRequest) {
    return await this.chatService.findChatByUserId(req.user.id);
  }

  @Post(':id/join')
  async joinChat(@Param('id') chatId: string, @Req() req: AuthenticatedRequest) {
    const result = await this.chatService.joinChat(chatId, req.user);

    const socket = this.socketGateway.server.sockets.sockets.get(`user:${req.user.id}`);

    if (socket) {
      this.socketGateway.addUserToRoom(socket, chatId);
    }

    return result;
  }
}
