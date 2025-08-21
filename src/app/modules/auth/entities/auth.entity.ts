import { Entity } from 'typeorm';

import { BaseEntity } from '@shared/utils/base_entity.util';

@Entity()
export class Auth extends BaseEntity<Auth> {

}
