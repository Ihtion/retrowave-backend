import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RetroItemService } from './retro-item.service';
import { CreateRetroItemDto } from './dto/create-retro-item.dto';
import { UpdateRetroItemDto } from './dto/update-retro-item.dto';

@Controller('retro-item')
export class RetroItemController {
  constructor(private readonly retroItemService: RetroItemService) {}

  @Post()
  create(@Body() createRetroItemDto: CreateRetroItemDto) {
    return this.retroItemService.create(createRetroItemDto);
  }

  @Get()
  findAll() {
    return this.retroItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.retroItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRetroItemDto: UpdateRetroItemDto) {
    return this.retroItemService.update(+id, updateRetroItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.retroItemService.remove(+id);
  }
}
