import { IsOptional } from 'class-validator';

export class GoogleLoginDto {
  credential: string;

  @IsOptional()
  clientId: string;

  @IsOptional()
  client_id: string;

  @IsOptional()
  select_by: string;
}
