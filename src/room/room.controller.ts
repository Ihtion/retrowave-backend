import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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

import { User } from '../user/entities/user.entity';
import { IRequest } from '../interfaces/common.interface';

import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rooms')
export class RoomController {
  constructor(
    private readonly _roomService: RoomService,
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() request: IRequest, @Body() createRoomDto: CreateRoomDto) {
    const {
      user: { id: userID },
    } = request;

    const user = await this._usersRepository.findOne(userID);

    return this._roomService.create(user, createRoomDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() request: IRequest) {
    const {
      user: { id: userID },
    } = request;

    const user = await this._usersRepository.findOne(userID);

    return this._roomService.findAll(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this._roomService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this._roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this._roomService.remove(+id);
  }
}
