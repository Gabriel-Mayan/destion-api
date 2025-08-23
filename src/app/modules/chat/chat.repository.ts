import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Chat } from './chat.entity';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(private dataSource: DataSource) {
    super(Chat, dataSource.createEntityManager());
  }

}
