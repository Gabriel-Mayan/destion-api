import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class CryptoService {
  private readonly saltRounds = 10;

  async encrypt(password: string) {
    return await hash(password, this.saltRounds);
  }

  async compare(password: string, hashed: string) {
    return await compare(password, hashed);
  }
}
