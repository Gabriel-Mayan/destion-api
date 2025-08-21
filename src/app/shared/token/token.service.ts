import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyToken<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token);
  }

  decodeToken<T = any>(token: string): T {
    return this.jwtService.decode(token);
  }
}
