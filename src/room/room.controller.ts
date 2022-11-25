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
  HttpCode,
  BadRequestException,
} from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { IRequest } from '../interfaces/common.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GroomingSession } from '../groomingSession/grooming-session.entity';

import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomSerializer, SerializedRoom } from './room.serializer';

@Controller('rooms')
export class RoomController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(GroomingSession)
    private readonly sessionRepository: Repository<GroomingSession>,
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

    const user = await this.usersRepository.findOne(userID);

    const newRoom = await this.roomRepository.save(
      this.roomRepository.create({ ...createRoomDto, user }),
    );

    await this.sessionRepository.save(
      this.sessionRepository.create({
        users: {},
        room: newRoom,
      }),
    );

    return RoomSerializer.serialize(newRoom);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async remove(
    @Req() request: IRequest,
    @Param('id') roomID: string,
  ): Promise<void> {
    const {
      user: { id: userID },
    } = request;

    const room = await this.roomRepository
      .createQueryBuilder('room')
      .where('room.id = :roomID AND room.userId = :userID', { userID, roomID })
      .getOne();

    if (room === undefined) {
      throw new NotFoundException();
    }

    await this.roomRepository.remove(room);
  }

  @Patch(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() request: IRequest,
    @Param('id') roomID: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<void> {
    const {
      user: { id: userID },
    } = request;

    const room = await this.roomRepository
      .createQueryBuilder('room')
      .where('room.id = :roomID AND room.userId = :userID', { userID, roomID })
      .getOne();

    if (room === undefined) {
      throw new NotFoundException();
    }

    if (updateRoomDto.name) {
      const roomWithTheSameName = await this.roomRepository.findOne({
        where: { name: updateRoomDto.name },
      });

      if (roomWithTheSameName !== undefined) {
        throw new BadRequestException(
          "Room with the same 'name' already exists",
        );
      }
    }

    await this.roomRepository.update(roomID, updateRoomDto);
  }

  @Get('/all')
  async findAll(): Promise<SerializedRoom[]> {
    const rooms = await this.roomRepository.find();

    return RoomSerializer.serializeMany(rooms);
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async findMy(@Req() request: IRequest): Promise<SerializedRoom[]> {
    const {
      user: { id: userID },
    } = request;

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userID })
      .leftJoinAndSelect('user.savedRooms', 'room')
      .getOne();

    const savedRooms = user?.savedRooms ?? [];

    const ownedRooms = await this.roomRepository
      .createQueryBuilder('room')
      .where('room.userId = :userId', { userId: userID })
      .getMany();

    const myRooms = [...ownedRooms, ...savedRooms];

    return RoomSerializer.serializeMany(myRooms);
  }

  @HttpCode(204)
  @Post('/my/:id')
  @UseGuards(JwtAuthGuard)
  async addToSaved(
    @Req() request: IRequest,
    @Param('id') id: string,
  ): Promise<void> {
    const {
      user: { id: userID },
    } = request;

    const user = await this.usersRepository.findOne(userID);
    const room = await this.roomRepository.findOne(id);

    if (room === undefined) {
      throw new NotFoundException();
    }

    await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'savedRooms')
      .of(user)
      .add(room);
  }

  @HttpCode(204)
  @Delete('/my/:id')
  @UseGuards(JwtAuthGuard)
  async removeFromSaved(
    @Req() request: IRequest,
    @Param('id') id: string,
  ): Promise<void> {
    const {
      user: { id: userID },
    } = request;

    const user = await this.usersRepository.findOne(userID);
    const room = await this.roomRepository.findOne(id);

    if (room === undefined) {
      throw new NotFoundException();
    }

    await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'savedRooms')
      .of(user)
      .remove(room);
  }
}
