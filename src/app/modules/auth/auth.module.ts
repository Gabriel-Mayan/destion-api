import { Module } from '@nestjs/common';
import { UserRepository } from '@modules/user/user.repository';

import { TokenService } from '@shared/token/token.service';
import { CryptoService } from '@shared/crypto/crypto.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, CryptoService, UserRepository],
})
export class AuthModule {}
