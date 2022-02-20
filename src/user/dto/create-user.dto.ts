import { Length, Validate } from 'class-validator';

import { User } from '../entities/user.entity';
import { UniqueValidator } from '../../utils/unique-validator';

export class CreateUserDto {
  @Length(6, 20)
  @Validate(UniqueValidator, [User])
  username: string;

  @Length(6, 100)
  password: string;
}
