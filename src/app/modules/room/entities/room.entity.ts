import { Entity } from 'typeorm';

import { BaseEntity } from '@shared/utils/base_entity.util';

@Entity()
export class Room extends BaseEntity<Room> {

}
