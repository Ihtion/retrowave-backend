import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { IRequest } from '../interfaces/common.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rooms')
export class RoomController {
  constructor(private readonly _roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this._roomService.create(createRoomDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() request: IRequest) {
    const { user } = request;

    return this._roomService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._roomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this._roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._roomService.remove(+id);
  }
}
