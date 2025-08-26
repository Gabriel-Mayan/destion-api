import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { createAdapter } from '@socket.io/redis-adapter';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';

import { corsConfig } from '@config/cors.config';

import { RedisService } from '@infrastructure/redis/redis.service';
import { WsAuthMiddleware } from '@infrastructure/middlewares/ws-auth.middleware';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly configService: ConfigService,
    private readonly wsAuthMiddleware: WsAuthMiddleware,
    private readonly redisService: RedisService,
  ) {
    const corsOptions = corsConfig(this.configService);
    this.server = new Server({ cors: corsOptions });
  }

  async afterInit(server: Server) {
    this.wsAuthMiddleware.use(server);

    const pubClient = this.redisService.getPubClient();
    const subClient = this.redisService.getSubClient();

    server.adapter(createAdapter(pubClient, subClient));
  }

  async handleConnection(client: Socket) {
    const user = client.data.user;
    client.join(`user:${user.id}`);

    user.chats?.forEach((chat) => {
      client.join(chat.id);

      this.server.to(chat.id).emit('user-status', { userId: user.id, online: true });
    });
  }

  async handleDisconnect(client: Socket) {
    const user = client.data.user;

    Array.from(client.rooms)
      .filter((room) => room !== client.id)
      .forEach((room) => {
        client.leave(room);
        this.server.to(room).emit('user-status', { userId: user.id, online: false });
      });
  }

  addUserToRoom(socket: Socket, chatId: string) {
    const user = socket.data.user;
    socket.join(chatId);
    this.server.to(chatId).emit('user-joined', { userId: user.id });
    this.server.to(chatId).emit('user-status', { userId: user.id, online: true, });
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string },) {
    const user = client.data.user;
    client.leave(data.chatId);

    const socketsInRoom = await this.server.in(data.chatId).fetchSockets();
    const isUserStillInRoom = socketsInRoom.some((s) => s.data.user.id === user.id,);

    if (!isUserStillInRoom) {
      this.server.to(data.chatId).emit('user-status', { userId: user.id, online: false });
    }
  }
}
