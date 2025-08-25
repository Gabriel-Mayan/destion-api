import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '@modules/user/user.entity';

import { DateFnsService } from '@shared/datefns/datefns.service';

import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';
import { UserRepository } from '../user/user.repository';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
    private readonly dateFnsService: DateFnsService,
  ) { }

  private async formatChatDetails({ entities, raw, userId }: { entities: Chat[]; raw: any[]; userId: string }) {
    return await Promise.all(entities.map(async (chat, index) => {
      const rawData = raw[index];

      const creator = { id: rawData.creator_id, name: rawData.creator_name, }
      const isCreator = chat.creator.id === userId;
     
      const participants= chat.participants.map((p) => ({ id: p.id, name: p.name }));
      const isParticipant = chat.participants.some((participant) => participant.id === userId);
      const lastActivity = this.dateFnsService.formatRelativeTime(rawData.chat_last_activity || chat.createdAt);

      return {
        id: chat.id,
        name: chat.title,
        isPublic: chat.isPublic,
        description: chat.description,
        membersCount: chat.participants.length,
        isCreator,
        participants,
        isParticipant,
        creator,
        lastActivity,
      };
    }));
  }

  async createChat(dto: CreateChatDto): Promise<Chat> {
    const creator = await this.userRepository.findOne({ where: { id: dto.creatorId } });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const chat = this.chatRepository.create({
      title: dto.title,
      creator,
      description: dto.description,
      isPublic: dto.isPublic,
      participants: [creator],
    });

    return this.chatRepository.save(chat);
  }

  async findChatById(id: string): Promise<Chat> {
    const chat = await this.chatRepository.getChatDetails({ chatId: id });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async findChatByUserId(userId: string) {
    const chats = await this.chatRepository.getUserChatsByUserId({ userId });

    return this.formatChatDetails({ ...chats, userId });
  }

  async joinChat(chatId: string, user: User) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isAlreadyParticipant = chat.participants.some((p) => p.id === user.id);

    if (!isAlreadyParticipant) {
      chat.participants.push(user);
      await this.chatRepository.save(chat);
    }

    return await this.findChatById(chatId);
  }
}
