import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User', {})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true, nullable: false, length: 20 })
  username: string;

  @Column('text', { nullable: false })
  password: string;

  @Column('varchar', { nullable: true, length: 30 })
  nickname: string;

  @Column('boolean', { default: false })
  isAdmin: boolean;
}
