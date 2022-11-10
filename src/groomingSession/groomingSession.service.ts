import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { GroomingSessionUserMode } from '../interfaces/groomingSession.interface';

import { GroomingSession } from './groomingSession.entity';

@Injectable()
export class GroomingSessionService {
  constructor(
    @InjectRepository(GroomingSession)
    private readonly _sessionsRepository: Repository<GroomingSession>,
  ) {}

  async joinUser(user: User, session: GroomingSession) {
    const updatePayload = {
      users: {
        ...session.users,
        [user.id]: {
          mode: GroomingSessionUserMode.VOTER,
          email: user.email,
        },
      },
    };

    await this._sessionsRepository.update(session.id, {
      ...session,
      ...updatePayload,
    });
  }

  async leaveUser(user: User, session: GroomingSession) {
    const updatedUsersField = { ...session.users };

    delete updatedUsersField[user.id];

    await this._sessionsRepository.update(session.id, {
      users: updatedUsersField,
    });
  }
}
