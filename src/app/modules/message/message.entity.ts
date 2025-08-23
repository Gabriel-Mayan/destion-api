import { Column, Entity, ManyToOne } from 'typeorm';

import { Chat } from '@modules/chat/chat.entity';
import { User } from '@modules/user/user.entity';

import { BaseEntity } from '@shared/utils/base_entity.util';

@Entity()
export class Message extends BaseEntity<Message> {
  @Column("text")
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Column({ default: false })
  read: boolean;
}
