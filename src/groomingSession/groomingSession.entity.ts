import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  GroomingEstimation,
  GroomingSessionUser,
  GroomingState,
} from '../interfaces/groomingSession.interface';

import { Room } from '../room/entities/room.entity';

@Entity('GroomingSession', {})
export class GroomingSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json', { nullable: false })
  users: GroomingSessionUser;

  @Column('enum', { enum: GroomingState, default: GroomingState.INIT })
  state: GroomingState;

  @Column('json', { nullable: true })
  estimations: GroomingEstimation;

  @OneToOne(() => Room, (room) => room.groomingSession, { nullable: false })
  @JoinColumn()
  room: Room;
}
