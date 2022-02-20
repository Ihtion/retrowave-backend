import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { SerializedUser, UserSerializer } from '../user/user.serializer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<SerializedUser | null> {
    const user = await this._usersRepository.findOne({ where: { username } });

    if (user?.password === password) {
      return UserSerializer.serialize(user);
    }

    return null;
  }
}
