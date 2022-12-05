import { randomUUID } from 'crypto';

import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { SerializedUser, UserSerializer } from '../user/user.serializer';

import { JWTPayload, LoginResponse } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<SerializedUser | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user?.password === password) {
      return UserSerializer.serialize(user);
    }

    return null;
  }

  async login(user: SerializedUser): Promise<LoginResponse> {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginGoogle(googleCredential: string): Promise<LoginResponse> {
    const clientID = this.configService.get('GOOGLE_OAUTH_CLIENT_ID');

    const client = new OAuth2Client(clientID);

    const loginTicket = await client.verifyIdToken({
      idToken: googleCredential,
    });

    const userPayload = loginTicket.getPayload();

    const userEmail = userPayload.email;

    const existedUser = await this.userRepository.findOne({
      where: { email: userEmail },
    });

    if (existedUser) {
      return this.login(UserSerializer.serialize(existedUser));
    }

    const newUser = await this.userService.create({
      email: userEmail,
      password: randomUUID(),
    });

    return this.login(newUser);
  }
}
