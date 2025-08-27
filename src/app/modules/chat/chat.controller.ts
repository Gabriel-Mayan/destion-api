import { Controller, Post, Get, Param, Body, UseGuards, Req, Patch, Delete } from '@nestjs/common';

import { SocketGateway } from '@infrastructure/socket/socket.gateway';

import { AuthGuard } from '@shared/guards/auth.guard';
import { AuthenticatedRequest } from '@shared/interfaces/authenticated-request.interface';

import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chats')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly socketGateway: SocketGateway) { }

  @Post()
  async create(@Body() dto: CreateChatDto, @Req() req: AuthenticatedRequest) {
    const createdChat = await this.chatService.createChat(dto, req.user);

    if (createdChat.isPublic) {
      this.socketGateway.server.emit('chat', {
        type: 'created',
        data: createdChat,
      });
    }

    return createdChat;
  }

  @Get('me')
  async findMyChats(@Req() req: AuthenticatedRequest) {
    return await this.chatService.listChatsByUserId(req.user.id);
  }

  @Get(':id')
  async findChatById(@Param('id') id: string) {
    return await this.chatService.findChatById(id);
  }

  @Patch(':id')
  async updateChat(@Param('id') id: string, @Body() dto: UpdateChatDto, @Req() req: AuthenticatedRequest) {
    const updatedChat = await this.chatService.updateChat(id, dto, req.user.id);

    this.socketGateway.server.to(id).emit('chat', {
      type: 'updated',
      chatId: id,
      data: updatedChat,
    });

    return updatedChat;
  }

  @Delete(':id')
  async deleteChat(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.chatService.deleteChat(id, req.user.id);

    this.socketGateway.server.to(id).emit('chat', {
      type: 'deleted',
      chatId: id,
    });

    return { success: true };
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
