import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomSerializer, SerializedRoom } from './room.serializer';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly _roomsRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<SerializedRoom> {
    const newRoom = await this._roomsRepository.save(
      this._roomsRepository.create(createRoomDto),
    );

    return RoomSerializer.serialize(newRoom);
  }

  async findAll(): Promise<SerializedRoom[]> {
    const rooms = await this._roomsRepository.find();

    return RoomSerializer.serializeMany(rooms);
  }

  async findOne(id: number): Promise<SerializedRoom> {
    const room = await this._roomsRepository.findOne(id);

    return RoomSerializer.serialize(room);
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
