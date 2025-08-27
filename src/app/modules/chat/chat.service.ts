import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '@modules/user/user.entity';

import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) { }

  private formatChatDetails(chat: Chat, userId: string) {
    const isCreator = chat.creator.id === userId;
    const creator = { id: chat.creator.id, name: chat.creator.name };

    const participants = chat.participants.map((p) => ({ id: p.id, name: p.name }));
    const isParticipant = chat.participants.some((participant) => participant.id === userId);

    const latestMessage = chat.messages.reduce((latest: any, current) => {
      const currentActivity = current.deletedAt
        ? current.deletedAt.getTime()
        : current.updatedAt.getTime();

      if (!latest) return current;

      const latestActivity = latest.deletedAt
        ? latest.deletedAt.getTime()
        : latest.updatedAt.getTime();

      return currentActivity > latestActivity ? current : latest;
    }, null);

    const chatActivity = chat.updatedAt.getTime();
    const latestMessageActivity = latestMessage ? (latestMessage.deletedAt?.getTime() ?? latestMessage.updatedAt.getTime()) : null;

    const mostRecentActivity = latestMessageActivity ? Math.max(latestMessageActivity, chatActivity) : chatActivity;
    const lastActivity = new Date(mostRecentActivity);

    return {
      id: chat.id,
      name: chat.title,
      isPublic: chat.isPublic,
      description: chat.description,
      membersCount: chat.participants.length,
      creator,
      isCreator,
      participants,
      isParticipant,
      lastActivity,
    };
  }

  async createChat(dto: CreateChatDto, creator: User) {
    const chat = this.chatRepository.create({
      creator,
      title: dto.title,
      description: dto.description,
      isPublic: dto.isPublic,
      participants: [creator],
    });

    return await this.chatRepository.save(chat);
  }

  async findChatById(chatId: string) {
    const chat = await this.chatRepository.findOneBy({ id: chatId });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async listChatsByUserId(userId: string) {
    const chats = await this.chatRepository.listUserChatsByUserId({ userId });

    const formattedChats = chats.map(chat => this.formatChatDetails(chat, userId));

    formattedChats.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());

    return formattedChats;
  }

  async updateChat(chatId: string, dto: UpdateChatDto, userId: string): Promise<Chat> {
    const chat = await this.chatRepository.getChatWithCreator({ id: chatId });

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

  async deleteChat(chatId: string, userId: string): Promise<{ success: boolean }> {
    const chat = await this.chatRepository.getChatWithCreator({ id: chatId });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.creator.id !== userId) {
      throw new ForbiddenException('Not allowed to edit this chat');
    }

    await this.chatRepository.softDelete(chatId);

    return { success: true };
  }

  async joinChat(chatId: string, user: User) {
    const chat = await this.chatRepository.getChatDetails({ id: chatId });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isAlreadyParticipant = chat.participants.some((p) => p.id === user.id);

    if (!isAlreadyParticipant) {
      chat.participants.push(user);

      await this.chatRepository.save(chat);
    }

    return this.chatRepository.getChatDetails({ id: chatId });
  }
}
