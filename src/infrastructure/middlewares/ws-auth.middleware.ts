import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

import { UserRepository } from '@modules/user/user.repository';

@Injectable()
export class WsAuthMiddleware {
  private readonly logger: Logger;

  constructor(private readonly jwtService: JwtService, private readonly userRepository: UserRepository,) {
    this.logger = new Logger(WsAuthMiddleware.name);
  }

  use(server: Server) {
    server.use(async (client: Socket, next: (err?: Error) => void) => {
      const token = client.handshake.auth?.token;

      if (!token) {
        this.logger.warn(`Conexão rejeitada: token ausente (clientId=${client.id})`);
        return next(new Error('Missing token'));
      }

      try {
        const payload: any = this.jwtService.verify(token);

        const user = await this.userRepository.findOne({ where: { email: payload.email }, relations: ['chats'] });

        if (!user) {
          this.logger.warn(`Conexão rejeitada: usuário não encontrado (email=${payload.email})`);

          return next(new Error('Invalid token: user not found'));
        }

        client.data.user = user;

        next();
      } catch (err) {
        this.logger.warn(`Conexão rejeitada: token inválido ou expirado (clientId=${client.id})`);

        next(new Error('Invalid or expired token'));
      }
    });
  }
}
