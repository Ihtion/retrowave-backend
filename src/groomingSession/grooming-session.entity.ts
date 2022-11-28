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
import { UserIDType } from '../interfaces/common.interface';

@Entity('GroomingSession', {})
export class GroomingSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json', { nullable: false })
  users: GroomingSessionUser;

  @Column('enum', { enum: GroomingState, default: GroomingState.INIT })
  votingState: GroomingState;

  @Column('varchar', { nullable: true, length: 100 })
  votingComment: string;

  @Column('text', { nullable: true })
  votingInitiator: UserIDType;

  @Column('json', { nullable: true })
  estimations: GroomingEstimation;

  @OneToOne(() => Room, (room) => room.groomingSession, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  room: Room;

  @Column({ nullable: false })
  roomId: number;
}
