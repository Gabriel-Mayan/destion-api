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
      .leftJoin('chat.messages', 'message')
      .leftJoin('chat.creator', 'creator')
      .addSelect('creator.id')
      .addSelect('creator.name')
      .addSelect(subQuery =>
        subQuery
          .select('MAX(message.createdAt)', 'lastActivity')
          .from('message', 'message')
          .where('message.chatId = chat.id'),
        'chat_last_activity',
      )
      .where('participant.id = :userId OR creator.id = :userId OR chat.isPublic = true', { userId })
      .getRawAndEntities();
  }

  getChatDetails({ chatId }: { chatId: string }) {
    // TODO Corrigir essa query
    return this.findOne({
      where: { id: chatId },
      relations: ['creator', 'participants', 'messages', 'messages.sender'],
    });
  }
}
