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
  NotFoundException,
} from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { IRequest } from '../interfaces/common.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomSerializer, SerializedRoom } from './room.serializer';

@Controller('rooms')
export class RoomController {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly _roomsRepository: Repository<Room>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() request: IRequest,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<SerializedRoom> {
    const {
      user: { id: userID },
    } = request;

    const user = await this._usersRepository.findOne(userID);

    const newRoom = await this._roomsRepository.save(
      this._roomsRepository.create({ ...createRoomDto, user }),
    );

    return RoomSerializer.serialize(newRoom);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() request: IRequest): Promise<SerializedRoom[]> {
    const {
      user: { id: userID },
    } = request;

    const user = await this._usersRepository.findOne(userID);

    const rooms = await this._roomsRepository.find({
      where: { user },
    });

    return RoomSerializer.serializeMany(rooms);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const room = await this._roomsRepository.findOne(id);

    if (room === undefined) {
      throw new NotFoundException();
    }

    return RoomSerializer.serialize(room);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return `This action removes a #${id} room`;
  }

  @Get('/all/:key')
  async findOneByKey(@Param('key') key: string): Promise<SerializedRoom> {
    const room = await this._roomsRepository.findOne({ key });

    if (room === undefined) {
      throw new NotFoundException();
    }

    return RoomSerializer.serialize(room);
  }
}
