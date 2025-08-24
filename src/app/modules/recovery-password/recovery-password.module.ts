import { Module } from '@nestjs/common';

import { EmailService } from '@integrations/email/email.service';

import { RecoveryPasswordService } from './recovery-password.service';
import { RecoveryPasswordRepository } from './recovery-password.repository';

@Module({
  providers: [RecoveryPasswordRepository, EmailService, RecoveryPasswordService],
  exports: [RecoveryPasswordService],
})
export class RecoveryPasswordModule { }
