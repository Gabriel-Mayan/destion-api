import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthRepository extends Repository<Auth> {
  constructor(private dataSource: DataSource) {
    super(Auth, dataSource.createEntityManager());
  }

}
