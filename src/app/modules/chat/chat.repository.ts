import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Chat } from './chat.entity';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(private dataSource: DataSource) {
    super(Chat, dataSource.createEntityManager());
  }

  getChatByUserId({ userId }: { userId: string }) {
    return this.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  getChatDetails({ chatId }: { chatId: string }) {
    return this.findOne({
      where: { id: chatId },
      relations: ['creator', 'participants', 'messages'],
    });
  }
}
