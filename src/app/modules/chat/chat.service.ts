import { Injectable, NotFoundException } from '@nestjs/common';

import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';
import { UserRepository } from '../user/user.repository';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
  ) { }

  async createChat(dto: CreateChatDto): Promise<Chat> {
    const creator = await this.userRepository.findOne({ where: { id: dto.creatorId } });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const chat = this.chatRepository.create({
      title: dto.title,
      creator,
    });

    return this.chatRepository.save(chat);
  }

  async findChatById(id: string): Promise<Chat> {
    const chat = await this.chatRepository.getChatDetails({ chatId: id })

    if (!chat) {
      throw new NotFoundException('Chat not found')
    };

    return chat;
  }

  async findChatByUser(userId: string): Promise<Chat[]> {
    return this.chatRepository.getChatByUserId({ userId })
  }
}
