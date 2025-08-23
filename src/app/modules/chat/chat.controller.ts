import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';

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
    dto.creatorId = req.user.sub;

    return this.chatService.createChat(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findChatById(id);
  }

  @Get('me')
  findMyChats(@Req() req: AuthenticatedRequest) {
    return this.chatService.findChatByUser(req.user.sub);
  }
}
