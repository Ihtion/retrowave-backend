import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Room } from '../../room/entities/room.entity';

@Entity('RetroItem', {})
export class RetroItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.retroItems)
  room: string;
}
