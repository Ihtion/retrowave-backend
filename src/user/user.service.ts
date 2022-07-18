import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SerializedUser, UserSerializer } from './user.serializer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SerializedUser> {
    const newUser = await this._usersRepository.save(
      this._usersRepository.create(createUserDto),
    );

    return UserSerializer.serialize(newUser);
  }

  async findAll(): Promise<SerializedUser[]> {
    const users = await this._usersRepository.find();

    return UserSerializer.serializeMany(users);
  }

  async findOne(id: string): Promise<SerializedUser> {
    const user = await this._usersRepository.findOne({ where: { id } });

    return UserSerializer.serialize(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
