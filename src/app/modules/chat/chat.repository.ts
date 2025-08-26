import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Chat } from './chat.entity';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(private dataSource: DataSource) {
    super(Chat, dataSource.createEntityManager());
  }

  async getUserChatsByUserId({ userId }: { userId: string }) {
    return await this.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoin('chat.creator', 'creator')
      .leftJoinAndSelect('chat.messages', 'messages')
      .addSelect('creator.id')
      .addSelect('creator.name')
      .where('participant.id = :userId OR creator.id = :userId OR chat.isPublic = true', { userId })
      .getMany();
  }

  getChatDetails({ chatId }: { chatId: string }) {
    return this.findOne({
      where: { id: chatId },
      order: { messages: { createdAt: "ASC" } },
      relations: ['creator', 'participants', 'messages', 'messages.sender'],
    });
  }
}
