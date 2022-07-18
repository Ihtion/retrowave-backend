import { IsEmail, Length, Validate } from 'class-validator';

import { User } from '../entities/user.entity';
import { UniqueValidator } from '../../utils/unique-validator';

export class CreateUserDto {
  @IsEmail()
  @Validate(UniqueValidator, [User])
  email: string;

  @Length(6, 100)
  password: string;
}
