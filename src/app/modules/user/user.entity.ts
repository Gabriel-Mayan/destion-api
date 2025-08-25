import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { Chat } from '@modules/chat/chat.entity';
import { Message } from '@modules/message/message.entity';

import { BaseEntity } from '@shared/utils/base_entity.util';

@Entity()
export class User extends BaseEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => Chat, (chat) => chat.creator)
  createdChats: Chat[];
  
  @ManyToMany(() => Chat, (chat) => chat.participants)
  @JoinTable({
    name: 'user_chats',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chatId', referencedColumnName: 'id' },
  })
  chats: Chat[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_friends',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'friendId', referencedColumnName: 'id' },
  })
  friends: User[];
}
