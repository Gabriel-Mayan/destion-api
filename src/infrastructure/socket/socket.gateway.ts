import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

import { corsConfig } from '@config/cors.config';

import { RedisService } from '@infrastructure/redis/redis.service';

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger: Logger;

  constructor(private readonly redisService: RedisService, private readonly configService: ConfigService) {
    const corsOptions = corsConfig(this.configService);

    this.logger = new Logger(SocketGateway.name);
    this.server = new Server({ cors: corsOptions });
  }

  afterInit(server: Server) {
    this.logger.log('Chat Gateway inicializado');

    this.redisService.subscribe('chat-geral', (mensagem) => {
      this.server.emit('mensagem', mensagem);
    });
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('mensagem')
  async handleMensagem(@MessageBody() mensagem: any) {
    await this.redisService.publish('chat-geral', mensagem);
  }
}
