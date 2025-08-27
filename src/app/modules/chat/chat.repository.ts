import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Chat } from './chat.entity';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(private dataSource: DataSource) {
    super(Chat, dataSource.createEntityManager());
  }

  async listUserChatsByUserId({ userId }: { userId: string }) {
    return await this.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoin('chat.creator', 'creator')
      .leftJoinAndSelect('chat.messages', 'messages')
      .addSelect('creator.id')
      .addSelect('creator.name')
      .where('(participant.id = :userId OR creator.id = :userId OR chat.isPublic = true)', { userId })
      .andWhere('chat.deletedAt IS NULL')
      .getMany();
  }

  async getChatDetails({ id }: Pick<Chat, "id">) {
    return await this.findOne({
      where: { id },
      order: { messages: { createdAt: "ASC" } },
      relations: ['creator', 'participants', 'messages', 'messages.sender'],
    });
  }

  async getChatWithCreator({ id }: Pick<Chat, "id">) {
    return await this.findOne({
      where: { id },
      relations: ['creator'],
    });
  }
}
