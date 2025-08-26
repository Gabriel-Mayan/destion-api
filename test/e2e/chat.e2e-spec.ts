import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { ChatController } from '../../src/app/modules/chat/chat.controller';
import { ChatService } from '../../src/app/modules/chat/chat.service';
import { SocketGateway } from '../../src/infrastructure/socket/socket.gateway';
import { AuthGuard } from '../../src/app/shared/guards/auth.guard';

describe('ChatController (e2e)', () => {
  let app: INestApplication;

  const chatServiceMock = {
    createChat: jest.fn(),
    findChatByUserId: jest.fn(),
    joinChat: jest.fn(),
  };

  const socketGatewayMock = {
    server: { sockets: { sockets: new Map() } },
    addUserToRoom: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: ChatService, useValue: chatServiceMock },
        { provide: SocketGateway, useValue: socketGatewayMock },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'user1', name: 'Test User', avatarUrl: 'avatar.png' };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/chats (POST)', async () => {
    const mockChat = { id: 'chat1', title: 'My Chat' };
    chatServiceMock.createChat.mockResolvedValue(mockChat);

    await request(app.getHttpServer())
      .post('/chats')
      .send({ title: 'My Chat' })
      .expect(201)
      .expect(res => expect(res.body).toEqual(mockChat));
  });

  it('/chats/me (GET)', async () => {
    const mockChats = [{ id: 'chat1', title: 'Chat 1' }];
    chatServiceMock.findChatByUserId.mockResolvedValue(mockChats);

    await request(app.getHttpServer())
      .get('/chats/me')
      .expect(200)
      .expect(res => expect(res.body).toEqual(mockChats));
  });

  it('/chats/:id/join (POST)', async () => {
    const chatId = 'chat1';
    const mockResult = { success: true };
    chatServiceMock.joinChat.mockResolvedValue(mockResult);

    await request(app.getHttpServer())
      .post(`/chats/${chatId}/join`)
      .expect(201)
      .expect(res => expect(res.body).toEqual(mockResult));
  });
});
