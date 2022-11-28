import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';

import {
  GroomingSessionUserMode,
  GroomingState,
} from '../interfaces/groomingSession.interface';

import { User } from '../user/entities/user.entity';
import { UserIDType } from '../interfaces/common.interface';

import { GroomingSession } from './grooming-session.entity';

const EMPTY_SESSION_PAYLOAD = {
  users: {},
  estimations: {},
  votingState: GroomingState.INIT,
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

  async addUser(
    user: User,
    session: GroomingSession,
  ): Promise<GroomingSession> {
    const userAlreadyExists = Boolean(session.users[user.id]);

    if (userAlreadyExists) {
      return session;
    }

    const updatePayload = {
      users: {
        ...session.users,
        [user.id]: {
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

  async removeUser(session: GroomingSession, userID: UserIDType) {
    const updatedUsersField = { ...session.users };
    const updatedEstimationsField = { ...session.estimations };

    delete updatedUsersField[userID];
    delete updatedEstimationsField[userID];

    const shouldClearSession = Object.keys(updatedUsersField).length === 0;

    if (shouldClearSession) {
      await this.sessionsRepository.update(session.id, EMPTY_SESSION_PAYLOAD);
    } else {
      await this.sessionsRepository.update(session.id, {
        users: updatedUsersField,
        estimations: updatedEstimationsField,
      });
    }
  }

  async startVoting(
    sessionID: number,
    userID: UserIDType,
    votingComment: string | null,
  ): Promise<void> {
    await this.sessionsRepository.update(sessionID, {
      votingInitiator: userID,
      votingState: GroomingState.ACTIVE,
      votingComment,
      estimations: {},
    });
  }

  async finishVoting(sessionID: number): Promise<void> {
    await this.sessionsRepository.update(sessionID, {
      votingInitiator: null,
      votingState: GroomingState.FINISHED,
    });
  }

  async setEstimation(
    sessionID: number,
    userID: UserIDType,
    estimation: number | null,
  ): Promise<GroomingSession> {
    const session = await this.sessionsRepository.findOne(sessionID);

    if (session.votingState !== GroomingState.ACTIVE) {
      return session;
    }

    session.estimations[userID] = estimation;

    return this.sessionsRepository.save(session);
  }
}
