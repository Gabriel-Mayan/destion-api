import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Message } from '@modules/message/message.entity';

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
    const chat = await this.createQueryBuilder("chat")
      .leftJoinAndSelect("chat.creator", "creator")
      .leftJoinAndSelect("chat.participants", "participant")
      .leftJoinAndSelect("chat.messages", "message")
      .leftJoinAndSelect("message.sender", "sender")
      .where("chat.id = :id", { id })
      .orderBy("message.createdAt", "ASC")
      .getOne();

    if (!chat) return chat;

    chat.messages = await this.manager.getRepository(Message).createQueryBuilder("message")
      .withDeleted()
      .leftJoinAndSelect("message.sender", "sender")
      .where("message.chatId = :chatId", { chatId: chat.id })
      .orderBy("message.createdAt", "ASC")
      .getMany();

    return chat;
  }

  async getChatWithCreator({ id }: Pick<Chat, "id">) {
    return await this.findOne({
      where: { id },
      relations: ['creator'],
    });
  }
}
