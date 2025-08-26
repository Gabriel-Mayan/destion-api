import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { User } from '@modules/user/user.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatRepository } from '@modules/chat/chat.repository';

import { Message } from './message.entity';
import { MessageRepository } from './message.repository';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly chatRepository: ChatRepository, private readonly messageRepository: MessageRepository,) { }

  async sendMessage(dto: SendMessageDto, user: User): Promise<Message> {
    const chat = await this.chatRepository.getChatDetails({ chatId: dto.chatId });
    if (!chat) throw new NotFoundException('Chat not found');

    if (!chat.participants.find((p) => p.id === user.id)) {
      throw new ForbiddenException('User does not participate in chat');
    }

    const message = this.messageRepository.create({
      content: dto.content,
      chat,
      sender: user,
    });

    return this.messageRepository.save(message);
  }

  async updateMessage(dto: UpdateMessageDto, user: User): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: dto.messageId },
      relations: ['chat', 'sender'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sender.id !== user.id) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    message.content = dto.content;

    return this.messageRepository.save(message);
  }

  async deleteMessage(messageId: string, user: User): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['chat', 'sender'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sender.id !== user.id) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.messageRepository.remove(message);

    return message;
  }
}
