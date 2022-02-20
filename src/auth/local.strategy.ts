import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SerializedUser } from '../user/user.serializer';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<SerializedUser> {
    const user = await this._authService.validateUser(username, password);

    if (user === null) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
