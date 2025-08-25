// message.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from './message.entity';
import { Chat } from '@modules/chat/chat.entity';
import { User } from '@modules/user/user.entity';

import { SendMessageDto } from './dto/send-message.dto';
import { MessageRepository } from './message.repository';
import { ChatRepository } from '@modules/chat/chat.repository';
import { UserRepository } from '@modules/user/user.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
  ) { }

  async sendMessage(dto: SendMessageDto, user: User): Promise<Message> {
    const chat = await this.chatRepository.getChatDetails({ chatId: dto.chatId });
    if (!chat) throw new NotFoundException('Chat not found');

    
    if(!chat.participants.find(participant => participant.id === user.id)) {
      throw new NotFoundException('User does not participate in chat');
    }

    const message = this.messageRepository.create({
      content: dto.content,
      chat,
      sender: user,
    });

    return this.messageRepository.save(message);
  }
}
