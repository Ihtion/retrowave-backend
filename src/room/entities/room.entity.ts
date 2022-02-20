import { randomUUID } from 'crypto';

import { Length } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Room', {})
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true, nullable: false, length: 36 })
  key: string;

  @BeforeInsert()
  private generateKey() {
    this.key = randomUUID();
  }

  @Column('varchar', { nullable: true, length: 200 })
  @Length(1, 200)
  description: string;

  @Column('text', { nullable: true })
  password: string;
}
