// test/performance/socket.performance.spec.ts
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { SocketGateway } from '../../src/infrastructure/socket/socket.gateway';
import { WsAuthMiddleware } from '../../src/infrastructure/middlewares/ws-auth.middleware';
import { RedisService } from '../../src/infrastructure/redis/redis.service';

describe('SocketGateway Performance', () => {
  let gateway: SocketGateway;
  let serverMock: Partial<Server>;

  const mockUser = { id: 'user1', chats: [{ id: 'chat1' }] };

  beforeAll(async () => {
    serverMock = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      in: jest.fn().mockReturnValue({
        fetchSockets: jest.fn().mockResolvedValue([{ data: { user: mockUser } }]),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocketGateway,
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
        {
          provide: WsAuthMiddleware,
          useValue: { use: jest.fn() },
        },
        {
          provide: RedisService,
          useValue: {
            getPubClient: jest.fn(() => ({ duplicate: jest.fn(), on: jest.fn() })),
            getSubClient: jest.fn(() => ({ duplicate: jest.fn(), on: jest.fn() })),
            subscribe: jest.fn(async () => {}),
            publish: jest.fn(async () => {}),
          },
        },
      ],
    }).compile();

    gateway = module.get<SocketGateway>(SocketGateway);

    gateway.server = serverMock as Server;
  });

  const createMockSocket = (): Socket => {
    const rooms = new Set<string>();
    return {
      id: 'socket1',
      data: { user: mockUser },
      join: jest.fn((room) => rooms.add(room)),
      leave: jest.fn((room) => rooms.delete(room)),
      rooms,
    } as unknown as Socket;
  };

  it('envio de 100 mensagens + join/leave deve ser rápido', async () => {
    const NUM_CLIENTS = 5;
    const MESSAGES_PER_CLIENT = 20;

    const start = Date.now();

    const sockets = Array.from({ length: NUM_CLIENTS }).map(createMockSocket);

    for (const socket of sockets) {
      await gateway.handleConnection(socket);
      for (let i = 0; i < MESSAGES_PER_CLIENT; i++) {
        gateway.addUserToRoom(socket, 'chat1');
      }
    }

    await Promise.all(
      sockets.map((socket) => gateway.handleLeaveRoom(socket, { chatId: 'chat1' })),
    );

    const duration = Date.now() - start;
    console.log(`⏱️ 100 mensagens + join/leave para 5 clientes: ${duration}ms`);

    expect(duration).toBeLessThan(2000);
    expect(serverMock.to).toHaveBeenCalled();
    expect(serverMock.emit).toHaveBeenCalled();
  });
});
