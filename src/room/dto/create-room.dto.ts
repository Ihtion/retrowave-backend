import { IsOptional, Length } from 'class-validator';

export class CreateRoomDto {
  @Length(1, 100)
  name: string;

  @IsOptional()
  @Length(1, 200)
  description: string;

  @IsOptional()
  @Length(6, 200)
  password: string;
}
