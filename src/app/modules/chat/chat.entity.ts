import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { User } from '@modules/user/user.entity';
import { Message } from '@modules/message/message.entity';

import { BaseEntity } from '@shared/utils/base_entity.util';

@Entity()
export class Chat extends BaseEntity<Chat> {
  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.createdChats)
  creator: User;

  @Column({ default: true })
  isPublic: boolean;

  @ManyToMany(() => User, (user) => user.chats)
  participants: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
