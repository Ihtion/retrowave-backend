import { PartialType } from '@nestjs/mapped-types';
import { CreateRetroItemDto } from './create-retro-item.dto';

export class UpdateRetroItemDto extends PartialType(CreateRetroItemDto) {}
