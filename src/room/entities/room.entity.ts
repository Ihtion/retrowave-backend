import { Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RetroItem } from '../../retro-item/entities/retro-item.entity';

@Entity('Room', {})
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false, length: 100 })
  @Length(1, 100)
  name: string;

  @Column('varchar', { nullable: true, length: 200 })
  @Length(1, 200)
  description: string;

  @Column('text', { nullable: true })
  password: string;

  @OneToMany(() => RetroItem, (retroItem) => retroItem.room)
  retroItems: RetroItem[];
}
