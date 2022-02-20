import { Length } from 'class-validator';

export class UpdateUserDto {
  @Length(6, 30)
  nickname: string;
}
