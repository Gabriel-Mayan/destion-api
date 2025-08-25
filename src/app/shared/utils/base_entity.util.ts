import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity<T> {
  constructor(init?: Partial<T>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;
}
