import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWTEncoded, JWTPayload } from '../auth.interfaces';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'lol',
    });
  }

  async validate(payload: JWTEncoded): Promise<JWTPayload> {
    return {
      id: payload.id,
      username: payload.username,
      nickname: payload.nickname,
    };
  }
}
