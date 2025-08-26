import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '@modules/user/user.entity';

import { DateFnsService } from '@shared/datefns/datefns.service';

import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';
import { UserRepository } from '../user/user.repository';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
    private readonly dateFnsService: DateFnsService,
  ) { }

  private async formatChatDetails({ chats, userId }: { chats: Chat[]; userId: string }) {
    const formattedChats = await Promise.all(chats.map(async (chat, index) => {
      const isCreator = chat.creator.id === userId;
      const creator = { id: chat.creator.id, name: chat.creator.name };

      const participants = chat.participants.map((p) => ({ id: p.id, name: p.name }));
      const isParticipant = chat.participants.some((participant) => participant.id === userId);

      const latestMessage = chat.messages
        .filter(msg => !msg.deletedAt)
        .reduce((latest: any, current) => {
          const latestTime = latest ? Math.max(latest.createdAt.getTime(), latest.updatedAt.getTime()) : 0;
          const currentTime = Math.max(current.createdAt.getTime(), current.updatedAt.getTime());
          return currentTime > latestTime ? current : latest;
        }, null);


      const lastActivity = (latestMessage && latestMessage.updatedAt) || chat.updatedAt;

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

    formattedChats.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());

    return formattedChats.map(chat => ({
      ...chat,
      lastActivity: this.dateFnsService.formatRelativeTime(chat.lastActivity),
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
    const chat = await this.chatRepository.findOneBy({ id });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async findChatByUserId(userId: string) {
    const chats = await this.chatRepository.getUserChatsByUserId({ userId });

    return this.formatChatDetails({ chats, userId });
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

    const chatDetails = await this.chatRepository.getChatDetails({ chatId });

    if (!chatDetails) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async updateChat(id: string, dto: UpdateChatDto, userId: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({ where: { id }, relations: ['creator'] });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.creator.id !== userId) {
      throw new ForbiddenException('Not allowed to edit this chat');
    }

    chat.title = dto.title ?? chat.title;
    chat.description = dto.description ?? chat.description;
    chat.isPublic = dto.isPublic ?? chat.isPublic;

    return await this.chatRepository.save(chat);
  }

  async deleteChat(id: string, userId: string): Promise<{ success: boolean }> {
    const chat = await this.chatRepository.findOne({ where: { id }, relations: ['creator'] });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.creator.id !== userId) {
      throw new ForbiddenException('Not allowed to edit this chat');
    }

    await this.chatRepository.remove(chat);

    return { success: true };
  }
}
