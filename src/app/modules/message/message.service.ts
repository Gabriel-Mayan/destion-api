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

  async sendMessage(dto: SendMessageDto, user: User) {
    const chat = await this.chatRepository.getChatDetails({ id: dto.chatId });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

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

  async updateMessage(dto: UpdateMessageDto, user: User) {
    const message = await this.messageRepository.getMessageWithSenderAndChat({ id: dto.messageId });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sender.id !== user.id) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    message.content = dto.content;

    return this.messageRepository.save(message);
  }

  async deleteMessage(messageId: string, user: User) {
    const message = await this.messageRepository.getMessageWithSenderAndChat({ id: messageId });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sender.id !== user.id) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.messageRepository.softDelete(message.id);

    return message;
  }
}
