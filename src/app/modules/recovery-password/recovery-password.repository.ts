import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RecoveryPassword } from './recovery-password.entity';

@Injectable()
export class RecoveryPasswordRepository extends Repository<RecoveryPassword> {
  constructor(private dataSource: DataSource) {
    super(RecoveryPassword, dataSource.createEntityManager());
  }

  getUnusedRecoveryWithUser(token: string) {
    return this.findOne({ where: { token, isUsed: false }, relations: ['user'] });
  }
  
  getUnusedRecovery(token: string) {
    return this.findOne({ where: { token, isUsed: false } });
  }
}
