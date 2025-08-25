import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { UserRepository } from '@modules/user/user.repository';

import { AuthenticatedRequest } from '@shared/interfaces/authenticated-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOneBy({ email: payload.email })

      if(!user) {
        throw new UnauthorizedException('Invalid token');
      }

      request.user = user;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
