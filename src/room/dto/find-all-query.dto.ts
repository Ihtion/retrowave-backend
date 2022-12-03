import { IsOptional } from 'class-validator';

export class FindAllQueryDto {
  @IsOptional()
  limit = 10;

  @IsOptional()
  offset = 0;

  @IsOptional()
  search = '';
}
