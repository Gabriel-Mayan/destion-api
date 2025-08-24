import { Module } from '@nestjs/common';

import { EmailService } from '@integrations/email/email.service';

import { UserRepository } from '@modules/user/user.repository';
import { RecoveryPasswordService } from '@modules/recovery-password/recovery-password.service';

import { CryptoService } from '@shared/crypto/crypto.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RecoveryPasswordRepository } from '@modules/recovery-password/recovery-password.repository';

@Module({
  controllers: [AuthController],
  providers: [RecoveryPasswordRepository, EmailService, RecoveryPasswordService, AuthService, UserRepository, CryptoService],
  exports: [AuthService],
})
export class AuthModule { }
