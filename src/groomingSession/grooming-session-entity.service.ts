import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import {
  GroomingSessionUserMode,
  GroomingState,
} from '../interfaces/groomingSession.interface';

import { GroomingSession } from './grooming-session.entity';

@Injectable()
export class GroomingSessionEntityService implements OnModuleInit {
  constructor(
    @InjectRepository(GroomingSession)
    private readonly sessionsRepository: Repository<GroomingSession>,
  ) {}

  async onModuleInit() {
    await this.sessionsRepository.update(
      {},
      { users: {}, estimations: {}, state: GroomingState.INIT },
    );
  }

  async addConnection(
    user: User,
    session: GroomingSession,
    connectionID: string,
  ): Promise<void> {
    const updatePayload = {
      users: {
        ...session.users,
        [connectionID]: {
          mode: GroomingSessionUserMode.VOTER,
          email: user.email,
        },
      },
    };

    await this.sessionsRepository.update(session.id, {
      ...session,
      ...updatePayload,
    });
  }

  async removeConnection(session: GroomingSession, connectionID: string) {
    const updatedUsersField = { ...session.users };

    delete updatedUsersField[connectionID];

    await this.sessionsRepository.update(session.id, {
      users: updatedUsersField,
    });
  }
}
