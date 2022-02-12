import { Injectable } from '@nestjs/common';
import { CreateRetroItemDto } from './dto/create-retro-item.dto';
import { UpdateRetroItemDto } from './dto/update-retro-item.dto';

@Injectable()
export class RetroItemService {
  create(createRetroItemDto: CreateRetroItemDto) {
    return 'This action adds a new retroItem';
  }

  findAll() {
    return `This action returns all retroItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} retroItem`;
  }

  update(id: number, updateRetroItemDto: UpdateRetroItemDto) {
    return `This action updates a #${id} retroItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} retroItem`;
  }
}
