import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity<T> {
  constructor(init?: Partial<T>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", select: false, nullable: true })
  deletedAt: Date;
}
