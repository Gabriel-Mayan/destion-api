import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { MessageController } from '../../src/app/modules/message/message.controller';
import { MessageService } from '../../src/app/modules/message/message.service';
import { SocketGateway } from '../../src/infrastructure/socket/socket.gateway';
import { AuthGuard } from '../../src/app/shared/guards/auth.guard';

describe('MessageController (e2e)', () => {
  let app: INestApplication;

  const messageServiceMock = { sendMessage: jest.fn() };
  const socketGatewayMock = { server: { to: jest.fn().mockReturnThis(), emit: jest.fn() } };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        { provide: MessageService, useValue: messageServiceMock },
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

  it('/messages/send (POST)', async () => {
    const mockMessage = { content: 'Hello', createdAt: new Date().toISOString(), chat: { title: 'Test Chat' } };
    messageServiceMock.sendMessage.mockResolvedValue(mockMessage);

    const dto = { chatId: '1', content: 'Hello' };

    await request(app.getHttpServer())
      .post('/messages/send')
      .send(dto)
      .expect(201)
      .expect(res => {
        expect(res.body).toEqual(mockMessage);
        expect(socketGatewayMock.server.to).toHaveBeenCalledWith('1');
        expect(socketGatewayMock.server.emit).toHaveBeenCalledWith('message', expect.any(Object));
      });
  });
});
