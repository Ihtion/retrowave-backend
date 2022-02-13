import { IsOptional, Length } from 'class-validator';

export class UpdateRoomDto {
  @IsOptional()
  @Length(1, 200)
  description: string;

  @IsOptional()
  @Length(6, 100)
  password: string;
}
