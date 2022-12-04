import { Repository, Like, Not } from 'typeorm';
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
  Query,
  ForbiddenException,
} from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { IRequest } from '../interfaces/common.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GroomingSession } from '../groomingSession/grooming-session.entity';

import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomSerializer, SerializedRoom } from './room.serializer';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { CheckPasswordDto } from './dto/check-password.dto';

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

    const newRoom = await this.roomRepository.save(
      this.roomRepository.create({ ...createRoomDto, userId: userID }),
    );

    await this.sessionRepository.save(
      this.sessionRepository.create({
        users: {},
        room: newRoom,
      }),
    );

    return RoomSerializer.serialize(newRoom, userID);
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

    const room = await this.roomRepository.findOne({
      id: Number(roomID),
      userId: userID,
    });

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

    const room = await this.roomRepository.findOne({
      id: Number(roomID),
      userId: userID,
    });

    if (room === undefined) {
      throw new NotFoundException();
    }

    if (updateRoomDto.name) {
      const roomWithTheSameName = await this.roomRepository.findOne({
        where: { name: updateRoomDto.name, id: Not(roomID) },
      });

      if (roomWithTheSameName !== undefined) {
        throw new BadRequestException(
          "Room with the same 'name' already exists",
        );
      }
    }

    await this.roomRepository.update(roomID, updateRoomDto);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findByID(
    @Req() request: IRequest,
    @Param('id') roomID: string,
  ): Promise<{ room: SerializedRoom; userHasAccess: boolean }> {
    const {
      user: { id: userID },
    } = request;

    const room = await this.roomRepository
      .createQueryBuilder('room')
      .where('room.id = :id', { id: roomID })
      .leftJoinAndSelect('room.usersWithAccess', 'user')
      .getOne();

    if (room === undefined) {
      throw new NotFoundException();
    }

    const usersWithAccess = room.usersWithAccess.map(({ id }) => id);

    const userHasAccess =
      room.userId === userID || usersWithAccess.includes(userID);

    return {
      room: RoomSerializer.serialize(room, userID),
      userHasAccess,
    };
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Req() request: IRequest,
    @Query() query: FindAllQueryDto,
  ): Promise<{
    rooms: SerializedRoom[];
    total: number;
  }> {
    const {
      user: { id: userID },
    } = request;

    const [rooms, total] = await this.roomRepository.findAndCount({
      where: {
        name: Like(`%${query.search}%`),
      },
      take: query.limit,
      skip: query.offset,
    });

    return {
      rooms: RoomSerializer.serializeMany(rooms, userID),
      total,
    };
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
    const ownedRooms = await this.roomRepository.find({ userId: userID });

    const myRooms = [...ownedRooms, ...savedRooms];

    return RoomSerializer.serializeMany(myRooms, userID);
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

  @HttpCode(204)
  @Post('/check-password/:id')
  @UseGuards(JwtAuthGuard)
  async checkPassword(
    @Req() request: IRequest,
    @Param('id') roomID: string,
    @Body() { password }: CheckPasswordDto,
  ): Promise<void> {
    const {
      user: { id: userID },
    } = request;

    const room = await this.roomRepository.findOne(roomID);

    if (room === undefined) {
      throw new NotFoundException();
    }

    if (room.password !== password) {
      throw new ForbiddenException('Password is incorrect');
    }

    const user = await this.usersRepository.findOne(userID);

    await this.roomRepository
      .createQueryBuilder()
      .relation(Room, 'usersWithAccess')
      .of(room)
      .add(user);
  }
}
