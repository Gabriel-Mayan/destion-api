import * as crypto from 'crypto';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { EmailService } from '@integrations/email/email.service';

import { User } from '@modules/user/user.entity';

import { RecoveryPassword } from './recovery-password.entity';
import { RecoveryPasswordRepository } from './recovery-password.repository';

@Injectable()
export class RecoveryPasswordService {
  constructor(
    private readonly emailService: EmailService,
    private readonly recoveryRepository: RecoveryPasswordRepository,
  ) {}

  async createToken(user: User): Promise<RecoveryPassword> {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos

    const recovery = this.recoveryRepository.create({
      user,
      token,
      isUsed: false,
      expiresAt,
    });

    await this.recoveryRepository.save(recovery);

    await this.emailService.sendRecoveryEmail(user, token, expiresAt)

    return recovery;
  }

  async validateToken(token: string): Promise<RecoveryPassword> {
    const recovery = await this.recoveryRepository.getUnusedRecoveryWithUser(token);

    if (!recovery) 
      throw new BadRequestException('Invalid token');

    if (recovery.expiresAt && recovery.expiresAt < new Date())
      throw new BadRequestException('Token expired');

    return recovery;
  }

  async markAsUsed(token: string): Promise<void> {
    const recovery = await this.recoveryRepository.getUnusedRecovery(token);

    if (!recovery) 
      throw new NotFoundException('Recovery record not found');

    recovery.isUsed = true;

    await this.recoveryRepository.save(recovery);
  }
}
