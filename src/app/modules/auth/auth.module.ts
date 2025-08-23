import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from '@modules/user/user.repository';

import { CryptoService } from '@shared/crypto/crypto.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtService, CryptoService],
  exports: [AuthService],
})
export class AuthModule { }
