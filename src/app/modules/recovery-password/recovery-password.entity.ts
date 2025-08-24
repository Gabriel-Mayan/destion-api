import { Column, Entity, ManyToOne } from 'typeorm';

import { User } from '@modules/user/user.entity';

import { BaseEntity } from '@shared/utils/base_entity.util';

@Entity()
export class RecoveryPassword extends BaseEntity<RecoveryPassword> {
    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    user: User;

    @Column()
    token: string;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt?: Date;

    @Column({ default: false })
    isUsed: boolean;
}
