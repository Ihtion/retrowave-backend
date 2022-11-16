import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import {
  GroomingSessionUserMode,
  GroomingState,
} from '../interfaces/groomingSession.interface';

import { GroomingSession } from './grooming-session.entity';

const EMPTY_SESSION_PAYLOAD = {
  users: {},
  estimations: {},
  state: GroomingState.INIT,
  votingInitiator: null,
  votingComment: null,
};

@Injectable()
export class GroomingSessionEntityService implements OnModuleInit {
  constructor(
    @InjectRepository(GroomingSession)
    private readonly sessionsRepository: Repository<GroomingSession>,
  ) {}

  async onModuleInit() {
    await this.sessionsRepository.update({}, EMPTY_SESSION_PAYLOAD);
  }

  async addConnection(
    user: User,
    session: GroomingSession,
    connectionID: string,
  ): Promise<GroomingSession> {
    const updatePayload = {
      users: {
        ...session.users,
        [connectionID]: {
          mode: GroomingSessionUserMode.VOTER,
          email: user.email,
        },
      },
    };

    return this.sessionsRepository.save({
      ...session,
      ...updatePayload,
    });
  }

  async removeConnection(session: GroomingSession, connectionID: string) {
    const updatedUsersField = { ...session.users };
    const updatedEstimationsField = { ...session.estimations };

    delete updatedUsersField[connectionID];
    delete updatedEstimationsField[connectionID];

    if (Object.keys(updatedUsersField).length === 0) {
      await this.sessionsRepository.update(session.id, EMPTY_SESSION_PAYLOAD);

      return;
    }

    await this.sessionsRepository.update(session.id, {
      users: updatedUsersField,
      estimations: updatedEstimationsField,
    });
  }

  async startVoting(
    sessionID: number,
    connectionID: string,
    votingComment: string | null,
  ): Promise<void> {
    await this.sessionsRepository.update(sessionID, {
      votingInitiator: connectionID,
      state: GroomingState.ACTIVE,
      votingComment,
      estimations: {},
    });
  }

  async finishVoting(sessionID: number): Promise<void> {
    await this.sessionsRepository.update(sessionID, {
      votingInitiator: null,
      state: GroomingState.FINISHED,
    });
  }

  async setEstimation(
    sessionID: number,
    connectionID: string,
    estimation: number | null,
  ): Promise<GroomingSession> {
    const session = await this.sessionsRepository.findOne(sessionID);

    session.estimations[connectionID] = estimation;

    return this.sessionsRepository.save(session);
  }
}
