import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '../../roles/role.enum';

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

  @Column('set', { enum: Role, default: [Role.User] })
  roles: Role[];
}
