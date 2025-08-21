import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Room } from './entities/room.entity';

@Injectable()
export class RoomRepository extends Repository<Room> {
  constructor(private dataSource: DataSource) {
    super(Room, dataSource.createEntityManager());
  }

}
