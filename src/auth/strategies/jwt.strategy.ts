import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWTEncoded, JWTPayload } from '../auth.interfaces';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get('SECRET_KEY'),
    });
  }

  async validate(payload: JWTEncoded): Promise<JWTPayload> {
    return {
      id: payload.id,
      email: payload.email,
      nickname: payload.nickname,
      roles: payload.roles,
    };
  }
}
