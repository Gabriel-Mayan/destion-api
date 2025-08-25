import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { corsConfig } from '@config/cors.config';

import { RedisService } from '@infrastructure/redis/redis.service';
import { WsAuthMiddleware } from '@infrastructure/middlewares/ws-auth.middleware';

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger: Logger;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly wsAuthMiddleware: WsAuthMiddleware,
  ) {
    this.logger = new Logger(SocketGateway.name);

    const corsOptions = corsConfig(this.configService);
    this.server = new Server({ cors: corsOptions });
  }

  afterInit(server: Server) {
    this.wsAuthMiddleware.use(server);
  }

  handleConnection(client: Socket) {
    const user = client.data.user;
    this.logger.log(`Cliente conectado: ${user}`);
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    this.logger.log(`Cliente desconectado: ${user?.email ?? client.id}`);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string; userId: string }) {
    client.join(data.chatId);

    await this.redisService.addToSet(`chat:${data.chatId}:users`, data.userId);

    this.logger.log(`Usuário ${data.userId} entrou na sala ${data.chatId}`);

    this.server.to(data.chatId).emit('user-joined', { userId: data.userId });
  }

  @SubscribeMessage('message')
  async handleMensagem(@ConnectedSocket() client: Socket, @MessageBody() data: { chatId: string; userId: string; message: string }) {
    await this.redisService.publish(`chat:${data.chatId}`, data);

    this.server.to(data.chatId).emit('message', data);
  }
}
