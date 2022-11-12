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

  async join(
    user: User,
    session: GroomingSession,
    socketID: string,
  ): Promise<void> {
    const updatePayload = {
      users: {
        ...session.users,
        [socketID]: {
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

  async leave(session: GroomingSession, socketID: string) {
    const updatedUsersField = { ...session.users };

    delete updatedUsersField[socketID];

    await this._sessionsRepository.update(session.id, {
      users: updatedUsersField,
    });
  }
}
