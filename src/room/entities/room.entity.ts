import { Length } from 'class-validator';

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { UserIDType } from '../../interfaces/common.interface';
import { GroomingSession } from '../../groomingSession/grooming-session.entity';

@Entity('Room', {})
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rooms, { nullable: false })
  user: User;

  @Column({ nullable: false })
  userId: UserIDType;

  @Column('varchar', { unique: true, nullable: false, length: 100 })
  @Length(1, 100)
  name: string;

  @Column('varchar', { nullable: true, length: 200 })
  @Length(1, 200)
  description: string;

  @Column('text', { nullable: true })
  password: string;

  @OneToOne(() => GroomingSession, (session) => session.room, {
    nullable: true,
  })
  groomingSession: GroomingSession;

  @ManyToMany(() => User)
  @JoinTable()
  usersWithAccess: User[];
}
