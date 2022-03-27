import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { JWTPayload, LoginResponse } from './auth.interfaces';
import { SerializedUser, UserSerializer } from '../user/user.serializer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
    private readonly _jwtService: JwtService,
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

  async login(user: SerializedUser): Promise<LoginResponse> {
    const payload: JWTPayload = {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      roles: user.roles,
    };

    return {
      access_token: this._jwtService.sign(payload),
    };
  }
}
