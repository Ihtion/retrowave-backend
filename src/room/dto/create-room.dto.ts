import { IsOptional, Length, Validate } from 'class-validator';

import { Room } from '../entities/room.entity';
import { UniqueValidator } from '../../utils/unique-validator';

export class CreateRoomDto {
  @Length(1, 100)
  @Validate(UniqueValidator, [Room])
  name: string;

  @IsOptional()
  @Length(0, 200)
  description: string;

  @IsOptional()
  @Length(6, 100)
  password: string;
}
