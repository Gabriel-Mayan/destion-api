import { Controller, Post, Get, Param, Body, UseGuards, Req, Logger } from '@nestjs/common';

import { AuthGuard } from '@shared/guards/auth.guard';
import { AuthenticatedRequest } from '@shared/interfaces/authenticated-request.interface';

import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chats')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  
  @Post()
  create(@Body() dto: CreateChatDto, @Req() req: AuthenticatedRequest) {
    dto.creatorId = req.user.id;

    return this.chatService.createChat(dto);
  }

  @Get('me')
  async findMyChats(@Req() req: AuthenticatedRequest) {
    return await this.chatService.findChatByUserId(req.user.id);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findChatById(id);
  }
  
  @Post(':id/join')
  async joinChat(@Param('id') chatId: string, @Req() req: AuthenticatedRequest) {
    return await this.chatService.joinChat(chatId, req.user);
  }
}
