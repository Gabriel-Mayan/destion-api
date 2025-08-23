import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthGuard } from '@shared/guards/auth.guard';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtService, AuthGuard],
  exports: [UserService, UserRepository],
})

export class UserModule {}
