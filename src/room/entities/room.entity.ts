import { randomUUID } from 'crypto';

import { Length } from 'class-validator';

import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity('Room', {})
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rooms, { nullable: false })
  user: User;

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
